import { useState } from 'react';
import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import DashboardFooter from '@/components/layouts/Footer';
import { Download, X, FileJson, FileSpreadsheet, FileText } from 'lucide-react';

type ReportType =
  | 'sessions'
  | 'mentorActivity'
  | 'menteeProgress'
  | 'matchingStats'
  | 'feedbackAnalysis'
  | 'timeAnalytics';
type ExportFormat = 'json' | 'csv' | 'pdf';

interface ReportData {
  [key: string]: any;
}

interface ReportConfig {
  summaryText: string;
  filters: string[];
  details: ReportData[];
}

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string[]>([]);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mentors = [
    'Dr. Sarah Wilson',
    'Prof. Michael Brown',
    'Dr. Jennifer Garcia',
    'Dr. Robert Anderson',
    'Prof. Elizabeth Taylor',
    'Dr. David Chen',
    'Prof. Maria Rodriguez',
  ];
  const statuses = ['Active', 'Completed', 'Pending', 'Cancelled'];
  const periods = [
    'Last 7 Days',
    'Last 30 Days',
    'Last 3 Months',
    'Last 6 Months',
    'This Year',
  ];

  const reportConfigs: Record<ReportType, ReportConfig> = {
    sessions: {
      summaryText: 'All Mentoring Sessions',
      filters: ['mentor', 'status', 'period'],
      details: Array.from({ length: 25 }, (_, i) => ({
        sessionId: `SES-${1000 + i}`,
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        mentor: mentors[i % 7],
        mentee: `Student ${i + 1}`,
        duration: `${Math.floor(Math.random() * 3) + 1}h`,
        status: statuses[i % 4],
        topic: [
          'Career Planning',
          'Academic Support',
          'Skill Development',
          'Research Guidance',
        ][i % 4],
        rating: (Math.random() * 2 + 3).toFixed(1),
      })),
    },
    mentorActivity: {
      summaryText: 'Mentor Activity Report',
      filters: ['mentor', 'period'],
      details: Array.from({ length: 7 }, (_, i) => ({
        mentor: mentors[i],
        activeMentees: Math.floor(Math.random() * 8) + 3,
        totalSessions: Math.floor(Math.random() * 40) + 15,
        avgSessionDuration: `${(Math.random() * 1.5 + 1).toFixed(1)}h`,
        totalHours: Math.floor(Math.random() * 60) + 30,
        avgRating: (Math.random() * 1 + 4).toFixed(2),
        responseTime: `${Math.floor(Math.random() * 12) + 2}h`,
        completionRate: `${Math.floor(Math.random() * 15) + 85}%`,
      })),
    },
    menteeProgress: {
      summaryText: 'Mentee Progress Tracking',
      filters: ['mentor', 'period'],
      details: Array.from({ length: 20 }, (_, i) => ({
        menteeId: `MNT-${2000 + i}`,
        menteeName: `Student ${i + 1}`,
        assignedMentor: mentors[i % 7],
        sessionsCompleted: Math.floor(Math.random() * 12) + 3,
        lastSessionDate: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split('T')[0],
        progressStatus: ['Excellent', 'Good', 'Fair', 'Needs Attention'][i % 4],
        engagementLevel: ['High', 'Medium', 'Low'][i % 3],
        goalsAchieved: `${Math.floor(Math.random() * 5) + 3}/8`,
      })),
    },
    matchingStats: {
      summaryText: 'Matching Statistics',
      filters: ['period'],
      details: Array.from({ length: 15 }, (_, i) => ({
        matchId: `MCH-${3000 + i}`,
        mentor: mentors[i % 7],
        mentee: `Student ${i + 1}`,
        matchDate: new Date(
          Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split('T')[0],
        matchScore: `${Math.floor(Math.random() * 25) + 75}%`,
        status: ['Active', 'Completed', 'On Hold'][i % 3],
        durationDays: Math.floor(Math.random() * 150) + 30,
        sessionsCount: Math.floor(Math.random() * 15) + 5,
        satisfactionScore: (Math.random() * 1.5 + 3.5).toFixed(1),
      })),
    },
    feedbackAnalysis: {
      summaryText: 'Feedback & Ratings Analysis',
      filters: ['mentor', 'period'],
      details: Array.from({ length: 18 }, (_, i) => ({
        feedbackId: `FB-${4000 + i}`,
        date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        mentor: mentors[i % 7],
        mentee: `Student ${i + 1}`,
        sessionRating: (Math.random() * 2 + 3).toFixed(1),
        mentorRating: (Math.random() * 2 + 3).toFixed(1),
        communicationScore: Math.floor(Math.random() * 3) + 8,
        knowledgeScore: Math.floor(Math.random() * 2) + 8,
        helpfulnessScore: Math.floor(Math.random() * 3) + 7,
      })),
    },
    timeAnalytics: {
      summaryText: 'Time & Availability Analytics',
      filters: ['mentor', 'period'],
      details: Array.from({ length: 7 }, (_, i) => ({
        mentor: mentors[i],
        totalAvailableHours: Math.floor(Math.random() * 30) + 40,
        bookedHours: Math.floor(Math.random() * 25) + 20,
        utilizationRate: `${Math.floor(Math.random() * 20) + 60}%`,
        peakHours: [
          'Monday 2-4PM',
          'Tuesday 10-12PM',
          'Wed 3-5PM',
          'Thu 1-3PM',
          'Fri 2-4PM',
        ][i % 5],
        avgResponseTime: `${Math.floor(Math.random() * 8) + 2}h`,
        cancellations: Math.floor(Math.random() * 3),
        reschedules: Math.floor(Math.random() * 5) + 1,
      })),
    },
  };

  const handleReportSelect = (report: ReportType) => {
    setSelectedReport(report);
    setReportData([]);
    setSelectedMentors([]);
    setSelectedStatus([]);
    setSelectedPeriod([]);
  };

  const handleCheckboxChange = (
    value: string,
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (selected.includes(value)) {
      setter(selected.filter((item) => item !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const handleSelectAll = (
    items: string[],
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (selected.length === items.length) {
      setter([]);
    } else {
      setter([...items]);
    }
  };

  const getFilteredData = (): ReportData[] => {
    if (!selectedReport) return [];

    let data = reportConfigs[selectedReport].details;
    const filters = reportConfigs[selectedReport].filters;

    if (filters.includes('mentor') && selectedMentors.length > 0) {
      data = data.filter(
        (item) =>
          selectedMentors.includes(item.mentor) ||
          selectedMentors.includes(item.assignedMentor),
      );
    }
    if (filters.includes('status') && selectedStatus.length > 0) {
      data = data.filter((item) => selectedStatus.includes(item.status));
    }
    // Period filter is applied by date range in real implementation
    // For demo, we'll just return the data as is

    return data;
  };

  const handleViewReport = () => {
    if (!selectedReport) return;
    setIsLoading(true);
    setTimeout(() => {
      const filtered = getFilteredData();
      setReportData(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleExport = () => {
    const data = getFilteredData();
    const metadata = {
      report: selectedReport,
      generatedAt: new Date().toISOString(),
      filters: {
        mentor: selectedMentors,
        status: selectedStatus,
        period: selectedPeriod,
      },
    };

    if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify({ metadata, data }, null, 2)], {
        type: 'application/json',
      });
      downloadBlob(blob, `${selectedReport}_report.json`);
    } else if (exportFormat === 'csv') {
      const headers = data.length > 0 ? Object.keys(data[0]) : [];
      let csv = headers.join(',') + '\n';
      data.forEach((row) => {
        csv += headers.map((h) => row[h]).join(',') + '\n';
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadBlob(blob, `${selectedReport}_report.csv`);
    } else if (exportFormat === 'pdf') {
      // Note: For PDF export, you would need to import jsPDF
      alert(
        'PDF export feature requires jsPDF library. Exporting as JSON instead.',
      );
      const blob = new Blob([JSON.stringify({ metadata, data }, null, 2)], {
        type: 'application/json',
      });
      downloadBlob(blob, `${selectedReport}_report.json`);
    }

    setShowConfirmModal(false);
    setShowExportModal(false);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPreviewData = () => {
    const data = getFilteredData();
    if (exportFormat === 'json') {
      const metadata = {
        report: selectedReport,
        generatedAt: new Date().toISOString(),
        filters: {
          mentor: selectedMentors,
          status: selectedStatus,
          period: selectedPeriod,
        },
      };
      return JSON.stringify({ metadata, data }, null, 2);
    }
    return null;
  };

  const showFilters = (filterType: string): boolean => {
    if (!selectedReport) return false;
    return reportConfigs[selectedReport].filters.includes(filterType);
  };

  return (
    <div className='page-layout'>
      {/* Sidebar */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-6 md:py-8 lg:py-12 xl:py-16'>
          <div className='page-container'>
            {/* Header */}
            <div className='page-header'>
              <h1 className='page-title'>Academic Reports</h1>
            </div>

            <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5'>
              {/* Left Panel - Report Types */}
              <div className='lg:col-span-2'>
                <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6'>
                  <h3 className='mb-4 text-lg font-semibold text-gray-800 md:text-xl'>
                    Available Reports
                  </h3>
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1'>
                    {(
                      [
                        'sessions',
                        'mentorActivity',
                        'menteeProgress',
                        'matchingStats',
                        'feedbackAnalysis',
                        'timeAnalytics',
                      ] as ReportType[]
                    ).map((report) => (
                      <button
                        key={report}
                        onClick={() => handleReportSelect(report)}
                        className={`group relative w-full overflow-hidden rounded-lg border px-4 py-4 text-left text-sm font-medium transition md:text-base ${
                          selectedReport === report
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md'
                            : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <span className='font-semibold'>
                            {reportConfigs[report].summaryText}
                          </span>
                          {selectedReport === report && (
                            <span className='text-blue-600'>✓</span>
                          )}
                        </div>
                        <div className='mt-1 text-xs text-gray-500'>
                          {reportConfigs[report].details.length} records
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Filters and Report */}
              <div className='lg:col-span-3'>
                {selectedReport && (
                  <>
                    {/* Filters Section */}
                    <div className='mb-6 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 shadow-sm'>
                      <div className='mb-5 flex items-center justify-between'>
                        <h3 className='text-xl font-bold text-gray-800'>
                          Filter Options
                        </h3>
                        <button
                          onClick={() => {
                            setSelectedMentors([]);
                            setSelectedStatus([]);
                            setSelectedPeriod([]);
                          }}
                          className='text-sm text-blue-600 hover:text-blue-700 hover:underline'
                        >
                          Clear All
                        </button>
                      </div>
                      <div className='grid grid-cols-1 gap-5 md:grid-cols-3 text-left'>
                        {/* Mentor Filter */}
                        {showFilters('mentor') && (
                          <div>
                            <div className='mb-2 flex items-center justify-between'>
                              <label className='block text-sm font-semibold text-gray-800 md:text-base'>
                                Mentor
                              </label>
                              <button
                                onClick={() =>
                                  handleSelectAll(
                                    mentors,
                                    selectedMentors,
                                    setSelectedMentors,
                                  )
                                }
                                className='text-xs text-blue-600 hover:underline'
                              >
                                {selectedMentors.length === mentors.length
                                  ? 'Deselect All'
                                  : 'Select All'}
                              </button>
                            </div>
                            <div className='max-h-48 space-y-1.5 overflow-y-auto rounded-lg border border-gray-300 bg-white p-3 shadow-sm'>
                              {mentors.map((mentor) => (
                                <label
                                  key={mentor}
                                  className='flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition hover:bg-blue-50 md:text-base'
                                >
                                  <input
                                    type='checkbox'
                                    checked={selectedMentors.includes(mentor)}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        mentor,
                                        selectedMentors,
                                        setSelectedMentors,
                                      )
                                    }
                                    className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
                                  />
                                  <span className='flex-1 text-gray-700'>
                                    {mentor}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Status Filter */}
                        {showFilters('status') && (
                          <div>
                            <div className='mb-2 flex items-center justify-between'>
                              <label className='block text-sm font-semibold text-gray-800 md:text-base'>
                                Status
                              </label>
                              <button
                                onClick={() =>
                                  handleSelectAll(
                                    statuses,
                                    selectedStatus,
                                    setSelectedStatus,
                                  )
                                }
                                className='text-xs text-blue-600 hover:underline'
                              >
                                {selectedStatus.length === statuses.length
                                  ? 'Deselect All'
                                  : 'Select All'}
                              </button>
                            </div>
                            <div className='space-y-1.5 rounded-lg border border-gray-300 bg-white p-3 shadow-sm'>
                              {statuses.map((status) => (
                                <label
                                  key={status}
                                  className='flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition hover:bg-blue-50 md:text-base'
                                >
                                  <input
                                    type='checkbox'
                                    checked={selectedStatus.includes(status)}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        status,
                                        selectedStatus,
                                        setSelectedStatus,
                                      )
                                    }
                                    className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
                                  />
                                  <span className='flex-1 text-gray-700'>
                                    {status}
                                  </span>
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      status === 'Active'
                                        ? 'bg-green-500'
                                        : status === 'Completed'
                                          ? 'bg-blue-500'
                                          : status === 'Pending'
                                            ? 'bg-yellow-500'
                                            : 'bg-gray-500'
                                    }`}
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Period Filter */}
                        {showFilters('period') && (
                          <div>
                            <div className='mb-2 flex items-center justify-between'>
                              <label className='block text-sm font-semibold text-gray-800 md:text-base'>
                                Time Period
                              </label>
                            </div>
                            <div className='space-y-1.5 rounded-lg border border-gray-300 bg-white p-3 shadow-sm'>
                              {periods.map((period) => (
                                <label
                                  key={period}
                                  className='flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition hover:bg-blue-50 md:text-base'
                                >
                                  <input
                                    type='radio'
                                    name='period'
                                    checked={selectedPeriod.includes(period)}
                                    onChange={() => setSelectedPeriod([period])}
                                    className='h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
                                  />
                                  <span className='flex-1 text-gray-700'>
                                    {period}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className='mt-6 flex justify-end'>
                        <button
                          onClick={handleViewReport}
                          className='rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-blue-700 hover:shadow-lg md:text-lg'
                        >
                          View Report
                        </button>
                      </div>
                    </div>

                    {/* Report Content */}
                    {reportData.length > 0 && (
                      <div className='rounded-xl border border-gray-200 bg-white shadow-lg'>
                        <div className='border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6'>
                          <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                            <div>
                              <h3 className='text-xl font-bold text-gray-800 md:text-2xl'>
                                {reportConfigs[selectedReport].summaryText}
                              </h3>
                              <p className='mt-1 text-sm text-gray-600 md:text-base'>
                                <span className='font-semibold text-blue-600'>
                                  {reportData.length}
                                </span>{' '}
                                records found
                                {selectedMentors.length > 0 &&
                                  ` • ${selectedMentors.length} mentor(s) selected`}
                                {selectedStatus.length > 0 &&
                                  ` • ${selectedStatus.length} status(es) selected`}
                              </p>
                            </div>
                            <button
                              onClick={() => setShowExportModal(true)}
                              className='flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-green-600 hover:to-green-700 hover:shadow-lg md:text-base'
                            >
                              <Download size={20} />
                              Export Report
                            </button>
                          </div>
                        </div>

                        {/* Data Table */}
                        <div className='overflow-x-auto p-6'>
                          <table className='w-full border-collapse text-sm'>
                            <thead>
                              <tr className='border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-blue-50'>
                                {reportData.length > 0 &&
                                  Object.keys(reportData[0]).map((header) => (
                                    <th
                                      key={header}
                                      className='px-4 py-3.5 text-left text-xs font-bold tracking-wide text-gray-700 uppercase'
                                    >
                                      {header.replace(/([A-Z])/g, ' $1').trim()}
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.map((row, idx) => (
                                <tr
                                  key={idx}
                                  className={`border-b border-gray-100 transition hover:bg-blue-50 ${
                                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                  }`}
                                >
                                  {Object.values(row).map((value, i) => (
                                    <td
                                      key={i}
                                      className='px-4 py-3.5 text-gray-700'
                                    >
                                      <span className='text-sm'>{value}</span>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {isLoading && (
                      <div className='flex items-center justify-center py-12'>
                        <div className='text-lg font-semibold text-blue-600'>
                          Loading report...
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!selectedReport && (
                  <div className='flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50 p-12 shadow-sm'>
                    <div className='mb-4 text-6xl'>📊</div>
                    <p className='text-center text-xl font-semibold text-gray-700 md:text-2xl'>
                      Select a Report Type
                    </p>
                    <p className='mt-2 text-center text-base text-gray-500 md:text-lg'>
                      Choose from the available reports on the left to view
                      detailed analytics
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl md:p-8'>
            <button
              onClick={() => setShowExportModal(false)}
              className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
            >
              <X size={22} />
            </button>

            <h2 className='mb-6 text-2xl font-semibold text-gray-800 md:text-3xl'>
              Export Report
            </h2>

            {/* Format Selection */}
            <div className='mb-6'>
              <label className='mb-3 block text-lg font-medium text-gray-800'>
                Select Format
              </label>
              <div className='grid grid-cols-3 gap-4'>
                <button
                  onClick={() => setExportFormat('json')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${
                    exportFormat === 'json'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileJson
                    size={32}
                    className={
                      exportFormat === 'json'
                        ? 'text-blue-600'
                        : 'text-gray-600'
                    }
                  />
                  <span className='font-medium'>JSON</span>
                </button>
                <button
                  onClick={() => setExportFormat('csv')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${
                    exportFormat === 'csv'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileSpreadsheet
                    size={32}
                    className={
                      exportFormat === 'csv' ? 'text-blue-600' : 'text-gray-600'
                    }
                  />
                  <span className='font-medium'>CSV</span>
                </button>
                <button
                  onClick={() => setExportFormat('pdf')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${
                    exportFormat === 'pdf'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText
                    size={32}
                    className={
                      exportFormat === 'pdf' ? 'text-blue-600' : 'text-gray-600'
                    }
                  />
                  <span className='font-medium'>PDF</span>
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className='mb-6'>
              <h3 className='mb-3 text-lg font-medium text-gray-800'>
                Preview
              </h3>
              <div className='max-h-96 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4'>
                {exportFormat === 'json' ? (
                  <pre className='text-left text-xs text-gray-700'>
                    {getPreviewData()}
                  </pre>
                ) : (
                  <div className='overflow-x-auto'>
                    <table className='w-full border-collapse text-xs'>
                      <thead>
                        <tr className='border-b-2 border-gray-300 bg-blue-50'>
                          {reportData.length > 0 &&
                            Object.keys(reportData[0]).map((header) => (
                              <th
                                key={header}
                                className='px-3 py-2 text-left font-semibold'
                              >
                                {header}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className='border-b border-gray-200'>
                            {Object.values(row).map((value, i) => (
                              <td key={i} className='px-3 py-2'>
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {reportData.length > 10 && (
                      <p className='mt-2 text-center text-xs text-gray-500'>
                        ... and {reportData.length - 10} more rows
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Export Button */}
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowExportModal(false)}
                className='rounded-lg border border-gray-300 px-6 py-2 text-base font-medium text-gray-700 hover:bg-gray-100'
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirmModal(true)}
                className='rounded-lg bg-green-500 px-6 py-2 text-base font-medium text-white hover:bg-green-600'
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
            <h3 className='mb-4 text-xl font-semibold text-gray-800'>
              Confirm Export
            </h3>
            <p className='mb-6 text-base text-gray-600'>
              Are you sure you want to export this report as{' '}
              {exportFormat.toUpperCase()}?
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowConfirmModal(false)}
                className='rounded-lg border border-gray-300 px-6 py-2 text-base font-medium text-gray-700 hover:bg-gray-100'
              >
                No
              </button>
              <button
                onClick={handleExport}
                className='rounded-lg bg-green-500 px-6 py-2 text-base font-medium text-white hover:bg-green-600'
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
