#!/usr/bin/env python3
import subprocess
import re
import matplotlib.pyplot as plt
import numpy as np
import sys
from collections import defaultdict
import matplotlib.patches as mpatches
import os


def run_os_simulation(config_file):
    """Run the OS simulation and capture output"""
    try:
        script_dir = os.path.dirname(
            os.path.abspath(__file__))
        project_root = os.path.dirname(script_dir)

        print(f"Script directory: {script_dir}")
        print(f"Project root directory: {project_root}")

        print("Fixing shell script line endings...")
        subprocess.run(
            ["wsl", "-e", "bash", "-c",
             f"cd $(wslpath '{project_root}') && " +
             "sed -i '1s|^// filepath.*$||' src/syscalltbl.sh && " +
             "tr -d '\r' < src/syscalltbl.sh > src/syscalltbl.sh.tmp && " +
             "mv src/syscalltbl.sh.tmp src/syscalltbl.sh && " +
             "chmod +x src/syscalltbl.sh"],
            check=True
        )

        print("Compiling the project...")
        subprocess.run(["wsl", "-e", "bash", "-c", f"cd $(wslpath '{project_root}') && make all"],
                       check=True)

        print(f"Running OS simulation with {config_file}...")
        result = subprocess.run(
            ["wsl", "-e", "bash", "-c",
                f"cd $(wslpath '{project_root}') && ./os {config_file}"],
            capture_output=True,
            text=True
        )

        with open("os_output.txt", "w") as f:
            f.write(result.stdout)
        print("Raw output saved to os_output.txt for debugging")

        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running OS simulation: {e}")
        print(
            f"Command output: {e.output if hasattr(e, 'output') else 'No output'}")
        sys.exit(1)


def parse_output(output):
    """Parse the output to extract process execution data"""
    time_slot_pattern = re.compile(r"Time slot\s+(\d+)")
    load_process_pattern = re.compile(
        r"\tLoaded a process at .*, PID: (\d+),* PRIO: (\d+)")
    load_process_pattern_alt = re.compile(
        r"Loaded a process at .*, PID: (\d+).*PRIO: (\d+)")

    cpu_dispatch_pattern = re.compile(
        r"\tCPU (\d+): Dispatched process\s+(\d+)")
    cpu_running_pattern = re.compile(r"\tCPU (\d+): Process (\d+) is running")
    cpu_finish_pattern = re.compile(
        r"\tCPU (\d+): Processed\s+(\d+) has finished")

    processes = {}
    time_slots = []
    cpu_states = defaultdict(list)

    current_time = 0
    active_processes = defaultdict(lambda: None)

    print("Parsing output and looking for patterns...")
    print(f"First 10 lines of output:")
    for i, line in enumerate(output.split('\n')[:10]):
        print(f"  {i}: {line}")

    for line in output.split('\n'):
        time_match = time_slot_pattern.match(line)
        if time_match:
            current_time = int(time_match.group(1))
            time_slots.append(current_time)
            continue

        load_match = load_process_pattern.search(line)
        if not load_match:
            load_match = load_process_pattern_alt.search(line)

        if load_match:
            pid = int(load_match.group(1))
            priority = int(load_match.group(2))
            processes[pid] = priority
            print(f"Found process PID: {pid}, Priority: {priority}")
            continue

        dispatch_match = cpu_dispatch_pattern.search(line)
        if dispatch_match:
            cpu_id = int(dispatch_match.group(1))
            pid = int(dispatch_match.group(2))

            if active_processes[cpu_id] is not None and active_processes[cpu_id] != pid:
                cpu_states[cpu_id].append((current_time, None))

            active_processes[cpu_id] = pid
            cpu_states[cpu_id].append((current_time, pid))
            print(
                f"Time {current_time}: CPU {cpu_id} started running process {pid}")
            continue

        finish_match = cpu_finish_pattern.search(line)
        if finish_match:
            cpu_id = int(finish_match.group(1))
            pid = int(finish_match.group(2))

            cpu_states[cpu_id].append((current_time, None))
            active_processes[cpu_id] = None
            print(f"Time {current_time}: CPU {cpu_id} finished process {pid}")

    print(f"Found {len(processes)} processes and {len(time_slots)} time slots")
    print(f"CPU states tracking {len(cpu_states)} CPUs")

    for cpu_id, states in cpu_states.items():
        print(f"CPU {cpu_id} state changes: {len(states)}")
        if states:
            print(f"  First few states: {states[:5]}")

    final_time = max(time_slots) if time_slots else 0
    for cpu_id, pid in active_processes.items():
        if pid is not None:
            cpu_states[cpu_id].append((final_time, None))

    return processes, time_slots, cpu_states


def create_gantt_chart(processes, time_slots, cpu_states):
    """Create a Gantt chart from the parsed data"""
    if not processes:
        print("Error: No processes found to generate the Gantt chart.")
        return

    # Debug information
    print(f"Creating gantt chart with {len(processes)} processes")
    print(f"Time slots: {time_slots[:5]}...")
    for cpu_id, states in cpu_states.items():
        print(f"CPU {cpu_id}: {len(states)} state changes")
        if states:
            print(f"  Sample: {states[:3]}")

    max_time = max(time_slots) if time_slots else 0
    for cpu_events in cpu_states.values():
        for time, _ in cpu_events:
            max_time = max(max_time, time)

    if max_time == 0:
        print("Warning: No time data found. Chart may be empty.")
        max_time = 10

    fig, ax = plt.subplots(figsize=(15, 8))

    unique_priorities = sorted(set(processes.values()))
    num_priorities = len(unique_priorities)

    if num_priorities <= 10:
        colors = plt.cm.tab10.colors
    elif num_priorities <= 20:
        colors = plt.cm.tab20.colors
    else:
        colors1 = plt.cm.tab20.colors
        colors2 = plt.cm.Set3.colors
        colors3 = plt.cm.Dark2.colors
        colors = list(colors1) + list(colors2) + list(colors3)

    priority_to_color = {}
    for i, priority in enumerate(unique_priorities):
        priority_to_color[priority] = colors[i % len(colors)]

    num_cpus = len(cpu_states)
    if num_cpus == 0:
        print("No CPU state data found. Adding dummy CPU for visualization.")
        num_cpus = 1
        cpu_states[0] = []

    cpu_ids = sorted(cpu_states.keys())

    for cpu_id in cpu_ids:
        states = cpu_states[cpu_id]
        y_pos = num_cpus - cpu_id - 1

        if len(states) < 2:
            continue

        for i in range(len(states) - 1):
            start_time, pid = states[i]
            end_time, next_pid = states[i+1]

            if pid is not None:
                priority = processes.get(pid, 0)
                color = priority_to_color[priority]

                width = end_time - start_time
                if width > 0:
                    bar = ax.barh(y_pos, width, left=start_time,
                                  height=0.7, color=color, edgecolor='black',
                                  alpha=0.8, linewidth=1)

                    if width >= 1:
                        ax.text(start_time + width/2, y_pos,
                                f"P{pid}",
                                ha='center', va='center',
                                color='white' if sum(
                                    color[:3]) < 1.5 else 'black',
                                fontweight='bold', fontsize=9)
                    else:
                        ax.text(start_time + width/2, y_pos + 0.3,
                                f"P{pid}",
                                ha='center', va='bottom',
                                color='white' if sum(
                                    color[:3]) < 1.5 else 'black',
                                fontweight='bold', fontsize=7)
                        ax.annotate('', xy=(start_time + width/2, y_pos),
                                    xytext=(start_time + width/2, y_pos + 0.2),
                                    arrowprops=dict(arrowstyle="->", color='black'))

    # Set the y-ticks to show CPU IDs
    ax.set_yticks([num_cpus - i - 1 for i in range(num_cpus)])
    ax.set_yticklabels([f"CPU {i}" for i in cpu_ids])

    # Set x-axis limits and labels
    ax.set_xlim(0, max_time + 1)
    ax.set_xlabel('Time Slot', fontsize=12, fontweight='bold')

    ax.set_xticks(np.arange(0, max_time + 2, 1))
    ax.xaxis.grid(True, which='major', linestyle='-', color='gray', alpha=0.5)
    ax.set_axisbelow(True)

    for x in np.arange(0, max_time + 2, 1):
        ax.axvline(x=x, color='gray', linestyle='-', alpha=0.5, zorder=0)

    ax.set_ylabel('CPU', fontsize=12, fontweight='bold')

    priority_patches = []
    for priority in sorted(unique_priorities):
        color = priority_to_color[priority]
        priority_patches.append(mpatches.Patch(
            color=color, label=f'Priority {priority}'))

    if priority_patches:
        # Position legend outside of the plot to avoid overlapping with processes
        legend = ax.legend(handles=priority_patches,
                           loc='upper center',
                           bbox_to_anchor=(0.5, -0.10),
                           ncol=min(5, len(priority_patches)),
                           title="Process Priorities")
        plt.subplots_adjust(bottom=0.20)

    import os
    config_name = os.path.basename(sys.argv[1]) if len(sys.argv) > 1 else ""

    plt.title('Multi-Level Queue Scheduler Gantt Chart',
              fontsize=14, fontweight='bold')

    plt.tight_layout()

    for spine in ax.spines.values():
        spine.set_linewidth(1.5)
        spine.set_color('black')

    # Save the figure
    plt.savefig('mlq_gantt_chart.png', dpi=300, bbox_inches='tight')
    print("Gantt chart saved as 'mlq_gantt_chart.png'")

    # Show the figure
    plt.show()


def main():
    if len(sys.argv) < 2:
        print("Usage: python mlq_gantt.py <configuration_file>")
        print("Example: python mlq_gantt.py os_1_singleCPU_mlq")
        sys.exit(1)

    config_file = sys.argv[1]
    print(f"Running OS simulation with config: {config_file}")

    output = run_os_simulation(config_file)

    with open("os_output.txt", "w") as f:
        f.write(output)
    print("Raw output saved to os_output.txt for debugging")

    processes, time_slots, cpu_states = parse_output(output)

    if not processes:
        print("No process data found in the output. Check the simulation output format.")
        print("Check os_output.txt for the actual output from your OS simulation")
        sys.exit(1)

    print(
        f"Found {len(processes)} processes across {len(time_slots)} time slots")
    create_gantt_chart(processes, time_slots, cpu_states)


if __name__ == "__main__":
    main()
