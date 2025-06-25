from StaticError import *
from Symbol import *
from functools import reduce


def insert(scopes, identifier_name, identifier_type):
    """INSERT <identifier_name> <identifier_type>"""
    # Check if the identifier name is unvalid
    if not identifier_name.isidentifier() or not identifier_name[0].islower():
        raise InvalidInstruction(f"INSERT {identifier_name} {identifier_type}")
    # Check if the identifier type is unvalid
    if identifier_type not in ["number", "string"]:
        raise InvalidInstruction(f"INSERT {identifier_name} {identifier_type}")
    # Check if the identifier is already declared in the current scope
    current_scope = scopes[-1]
    if identifier_name in current_scope:
        raise Redeclared(f"INSERT {identifier_name} {identifier_type}")

    new_scope = {**current_scope, identifier_name: identifier_type}
    # Replace the current scope with the new scope
    return scopes[:-1] + [new_scope]


def assign(scopes, identifier_name, value):
    """ASSIGN <identifier_name> <value>"""
    # Helper function to find the identifier in the scopes
    def find_identifier_recursion(scopes_list, name, idx):
        if idx < 0:
            raise Undeclared(f"ASSIGN {identifier_name} {value}")

        current_scope = scopes_list[idx]

        if name in current_scope:
            value_in_scope = current_scope[name]
            # {"name": (identifier_type, value)} => (scope_idx, identifier_type)
            if isinstance(value_in_scope, tuple):
                return (idx, value_in_scope[0])
            # {"name": identifier_type} => (scope_idx, identifier_type)
            return (idx, value_in_scope)

        return find_identifier_recursion(scopes_list, name, idx - 1)

    def find_identifier(scopes_list, name):
        return find_identifier_recursion(scopes_list, name, len(scopes_list) - 1)

    # Helper function to determine the type and value of the variable
    def determine_value_information(value):
        if value.isdigit():
            return "number", int(value)
        if value.startswith("'") and value.endswith("'"):
            if len(value) < 2:
                raise InvalidInstruction(f"ASSIGN {identifier_name} {value}")
            if len(value) > 2 and not value[1:-1].isalnum():
                raise InvalidInstruction(f"ASSIGN {identifier_name} {value}")
            return "string", value[1:-1]
        if not value.isidentifier() or not value[0].islower():
            raise InvalidInstruction(f"ASSIGN {identifier_name} {value}")
        scope_idx, identifier_type = find_identifier(scopes, value)
        variable_scope = scopes[scope_idx]
        variable_value = variable_scope[value]
        if isinstance(variable_value, tuple):
            return identifier_type, variable_value[1]
        return identifier_type, value

    if not identifier_name.isidentifier() or not identifier_name[0].islower():
        raise InvalidInstruction(f"ASSIGN {identifier_name} {value}")
    value_type, actual_value = determine_value_information(value)
    scope_index, identifier_type = find_identifier(scopes, identifier_name)

    if identifier_type != value_type:
        raise TypeMismatch(f"ASSIGN {identifier_name} {value}")

    target_scope = scopes[scope_index]
    updated_scope = {**target_scope,
                     identifier_name: (identifier_type, actual_value)}

    return scopes[:scope_index] + [updated_scope] + scopes[scope_index+1:]


def begin(scopes):
    """BEGIN"""
    return scopes + [{}]


def end(scopes):
    """END"""
    if len(scopes) == 1:
        raise UnknownBlock()

    return scopes[:-1]


def lookup(scopes, identifier_name):
    """LOOKUP <identifier_name>"""
    def find_in_scopes_recursively(idx):
        if idx < 0:
            raise Undeclared(f"LOOKUP {identifier_name}")

        current_scope = scopes[idx]

        if identifier_name in current_scope:
            return idx

        return find_in_scopes_recursively(idx - 1)
    if not identifier_name.isidentifier() or not identifier_name[0].islower():
        raise InvalidInstruction(f"LOOKUP {identifier_name}")
    return find_in_scopes_recursively(len(scopes) - 1)


def print_scope(scopes):
    """PRINT"""
    # Helper function to gather visible variables in the current scope
    def gather_visible(index, visited, result):
        if index < 0:
            return result

        current_scope = scopes[index]

        # Helper function to get scope identifier names
        def get_scope_identifier_names(current_scope, accumulator):
            if not current_scope:
                return accumulator
            identifier_name = next(iter(current_scope))
            remaining = dict(
                filter(lambda item: item[0] != identifier_name, current_scope.items()))
            return get_scope_identifier_names(remaining, accumulator + [identifier_name])

        # Helper function to filter out already visited names
        def get_identifier_names_and_process(dictionary_items, visited_set, accumulator):
            if not dictionary_items:
                return accumulator

            name = dictionary_items[0]
            rest_items = dictionary_items[1:]

            if name not in visited_set:
                return get_identifier_names_and_process(rest_items, visited_set, accumulator + [name])
            return get_identifier_names_and_process(rest_items, visited_set, accumulator)

        # Helper function to create pairs of (identifier_name, scope_index)
        def create_pairs(names, idx, accumulator):
            if idx >= len(names):
                return accumulator
            return create_pairs(names, idx + 1, accumulator + [(names[idx], index)])

        # 1. Get the identifier names in the current scope [identifier_name_1, identifier_name_2,...]
        scope_keys = get_scope_identifier_names(current_scope, [])
        # 2. Get the unvisited identifier names in the current scope [identifier_name_1, identifier_name_2,...]
        scope_names = get_identifier_names_and_process(scope_keys, visited, [])
        # 3. Create pairs in the current scope [identifier_name_1, index), (identifier_name_2, index),...]
        level_pairs = create_pairs(scope_names, 0, [])
        # 4. Update the current result with the current scope identifier names
        new_result = level_pairs + result
        # 5. Update the visited set with the current scope identifier names
        new_visited = visited.union(set(scope_names))

        return gather_visible(index - 1, new_visited, new_result)

    visible_variables = gather_visible(len(scopes) - 1, set(), [])

    return " ".join(map(lambda pair: f"{pair[0]}//{pair[1]}", visible_variables))


def reverse_print_scope(scopes):
    """RPRINT"""
    def gather_visible(index, visited, result):
        if index < 0:
            return result

        current_scope = scopes[index]

        # Helper function to get scope identifier names
        def get_scope_identifier_names(current_scope, accumulator):
            if not current_scope:
                return accumulator
            identifier_name = next(iter(current_scope))
            remaining = dict(
                filter(lambda item: item[0] != identifier_name, current_scope.items()))
            return get_scope_identifier_names(remaining, accumulator + [identifier_name])

        # Helper function to filter out already visited names
        def get_identifier_names_and_process(dictionary_items, visited_set, accumulator):
            if not dictionary_items:
                return accumulator

            name = dictionary_items[0]
            rest_items = dictionary_items[1:]

            if name not in visited_set:
                return get_identifier_names_and_process(rest_items, visited_set, accumulator + [name])
            return get_identifier_names_and_process(rest_items, visited_set, accumulator)

        # Helper function to create pairs of (identifier_name, scope_index)
        def create_pairs(names, idx, accumulator):
            if idx >= len(names):
                return accumulator
            return create_pairs(names, idx + 1, accumulator + [(names[idx], index)])

        # 1. Get the identifier names in the current scope [identifier_name_1, identifier_name_2,...]
        scope_keys = get_scope_identifier_names(current_scope, [])
        # 2. Get the unvisited identifier names in the current scope [identifier_name_1, identifier_name_2,...]
        scope_names = get_identifier_names_and_process(scope_keys, visited, [])
        # 3. Create pairs in the current scope [identifier_name_1, index), (identifier_name_2, index),...]
        level_pairs = create_pairs(scope_names, 0, [])
        # 4. Update the current result with the current scope identifier names
        new_result = level_pairs + result
        # 5. Update the visited set with the current scope identifier names
        new_visited = visited.union(set(scope_names))

        return gather_visible(index - 1, new_visited, new_result)

    # Helper function to reverse the list of visible variables
    def reverse_list(lst, idx, accumulator):
        if idx < 0:
            return accumulator
        return reverse_list(lst, idx - 1, accumulator + [lst[idx]])

    visible_variables = gather_visible(len(scopes) - 1, set(), [])

    reversed_variables = reverse_list(
        visible_variables, len(visible_variables) - 1, [])

    return " ".join(map(lambda pair: f"{pair[0]}//{pair[1]}", reversed_variables))


def simulate(list_of_commands):
    def has_error(result):
        if not result:
            return False
        current = result[-1]
        return (
            current.startswith("Undeclared") or
            current.startswith("Redeclared") or
            current.startswith("TypeMismatch") or
            current.startswith("UnclosedBlock") or
            current.startswith("UnknownBlock") or
            current.startswith("Invalid")
        )

    def handle_insert(scopes, parts, results):
        return (insert(scopes, parts[1], parts[2]), results + ["success"])

    def handle_assign(scopes, parts, results):
        return (assign(scopes, parts[1], parts[2]), results + ["success"])

    def handle_begin(scopes, _, results):
        return (begin(scopes), results)

    def handle_end(scopes, _, results):
        return (end(scopes), results)

    def handle_lookup(scopes, parts, results):
        return (scopes, results + [str(lookup(scopes, parts[1]))])

    def handle_print(scopes, _, results):
        return (scopes, results + [print_scope(scopes)])

    def handle_rprint(scopes, _, results):
        return (scopes, results + [reverse_print_scope(scopes)])

    command_handlers = {
        "INSERT": handle_insert,
        "ASSIGN": handle_assign,
        "BEGIN": handle_begin,
        "END": handle_end,
        "LOOKUP": handle_lookup,
        "PRINT": handle_print,
        "RPRINT": handle_rprint,
    }

    def process_command(state, command):
        try:
            scopes, results = state

            if has_error(results):
                return state

            valid_keywords = ["INSERT", "ASSIGN", "LOOKUP",
                              "PRINT", "RPRINT", "BEGIN", "END"]
            found = any(command.startswith(kw) for kw in valid_keywords)
            if not found or command[0] == " ":
                raise InvalidInstruction("Invalid command")

            parts = command.split(" ", 1)
            command_type = parts[0]
            if command_type not in command_handlers:
                raise InvalidInstruction("Invalid command")
            if command != command.strip() or "  " in command:
                raise InvalidInstruction(f"{command}")
            rest = parts[1] if len(parts) > 1 else ""

            def parse_insert_args(text):
                insert_split_parts = text.split(" ", 1)
                if len(insert_split_parts) < 2:
                    raise InvalidInstruction(f"{command}")
                return [command_type, insert_split_parts[0], insert_split_parts[1]] if len(insert_split_parts) >= 2 else [command_type]

            def parse_assign_args(text):
                assign_split_parts = text.split(" ", 1)
                if len(assign_split_parts) < 2:
                    raise InvalidInstruction(f"{command}")
                return [command_type, assign_split_parts[0], assign_split_parts[1]] if len(assign_split_parts) >= 2 else [command_type]

            def parse_lookup_args(text):
                if not text.strip():
                    raise InvalidInstruction(f"{command}")
                return [command_type, text.strip()]

            def parse_no_args(text):
                if text.strip():
                    raise InvalidInstruction(f"{command}")
                return [command_type]

            parsers = {
                "INSERT": parse_insert_args,
                "ASSIGN": parse_assign_args,
                "BEGIN": parse_no_args,
                "END": parse_no_args,
                "LOOKUP": parse_lookup_args,
                "PRINT": parse_no_args,
                "RPRINT": parse_no_args
            }

            parser = parsers.get(command_type, lambda x: [command_type])
            parsed_parts = parser(rest)

            handler = command_handlers.get(
                command_type, lambda s, p, r: (s, r))
            return handler(scopes, parsed_parts, results)
        except (Redeclared, Undeclared, TypeMismatch, UnclosedBlock, UnknownBlock, InvalidInstruction) as e:
            return (scopes, [str(e)])

    initial_state = ([{}], [])
    final_scopes, results = reduce(
        process_command, list_of_commands, initial_state)

    if len(final_scopes) > 1 and not has_error(results):
        return [f"UnclosedBlock: {len(final_scopes) - 1}"]
    return results
