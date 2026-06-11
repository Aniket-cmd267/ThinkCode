import { useState } from "react";
import { ChevronDown, CheckCircle, XCircle, AlertCircle } from "lucide-react";

function normalizeNewlines(s = "") {
  return String(s).replace(/\\n/g, "\n");
}

export default function TestCaseResults({ results, totalTestCases, status, errorMessage, runtime, memory }) {
  const [expandedTestCase, setExpandedTestCase] = useState(0);

  const testCasesPassed = results?.filter((t) => t.passed).length || 0;

  // Determine status color and icon
  const getStatusStyle = () => {
    if (status === "accepted") {
      return {
        bgColor: "bg-green-950/40",
        borderColor: "border-green-600/40",
        textColor: "text-green-400",
        icon: CheckCircle,
      };
    } else if (status === "error") {
      return {
        bgColor: "bg-red-950/40",
        borderColor: "border-red-600/40",
        textColor: "text-red-400",
        icon: AlertCircle,
      };
    } else {
      return {
        bgColor: "bg-orange-950/40",
        borderColor: "border-orange-600/40",
        textColor: "text-orange-400",
        icon: XCircle,
      };
    }
  };

  const statusStyle = getStatusStyle();
  const StatusIcon = statusStyle.icon;

  return (
    <div className="h-full bg-[#0D0D0D] text-slate-100 flex flex-col">
      {/* Header Summary */}
      <div className={`${statusStyle.bgColor} border-b ${statusStyle.borderColor} p-4 md:p-6`}>
        <div className="flex items-start gap-4">
          <StatusIcon size={24} className={statusStyle.textColor} />
          <div className="flex-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className={`text-xl md:text-2xl font-bold ${statusStyle.textColor}`}>
                {status === "accepted"
                  ? "Accepted"
                  : status === "error"
                    ? "Compilation Error"
                    : "Wrong Answer"}
              </h2>
              {status !== "error" && (
                <span className="text-sm text-slate-300">
                  {testCasesPassed}/{totalTestCases} testcases passed
                </span>
              )}
            </div>

            {/* Error message if present */}
            {errorMessage && (
              <div className="mt-3 p-3 bg-black/40 rounded border border-red-600/20 text-red-300 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                {errorMessage}
              </div>
            )}

            {/* Runtime and Memory */}
            {status !== "error" && (
              <div className="mt-3 flex gap-6 text-sm text-slate-300">
                {runtime !== undefined && (
                  <div>
                    <span className="text-slate-400">Runtime:</span> {runtime}
                  </div>
                )}
                {memory !== undefined && (
                  <div>
                    <span className="text-slate-400">Memory:</span> {memory}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="flex-1 overflow-y-auto">
        {results && results.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {results.map((testCase, index) => (
              <div
                key={index}
                className={`border-l-4 ${
                  testCase.passed
                    ? "border-l-green-500 bg-green-950/10 hover:bg-green-950/20"
                    : "border-l-red-500 bg-red-950/10 hover:bg-red-950/20"
                } transition-colors`}
              >
                <button
                  onClick={() =>
                    setExpandedTestCase(expandedTestCase === index ? -1 : index)
                  }
                  className="w-full px-4 py-4 md:px-6 text-left flex items-center justify-between gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {testCase.passed ? (
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={18} className="text-red-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        Case {index + 1}:{" "}
                        <span className={testCase.passed ? "text-green-400" : "text-red-400"}>
                          {testCase.passed ? "Passed" : "Failed"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 flex-shrink-0 transition-transform ${
                      expandedTestCase === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expanded Details */}
                {expandedTestCase === index && (
                  <div className="px-4 py-4 md:px-6 bg-black/40 border-t border-white/[0.06] space-y-4">
                    {/* Input */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                        Input
                      </p>
                      <div className="bg-[#1A1A1A] border border-white/[0.06] rounded p-3 text-sm font-mono text-slate-200 overflow-x-auto">
                        {normalizeNewlines(testCase.input) || "(empty)"}
                      </div>
                    </div>

                    {/* Expected Output */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                        Expected Output
                      </p>
                      <div className="bg-green-950/20 border border-green-600/20 rounded p-3 text-sm font-mono text-green-300 overflow-x-auto">
                        {normalizeNewlines(testCase.expectedOutput) || "(empty)"}
                      </div>
                    </div>

                    {/* Actual Output */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                        Output
                      </p>
                      <div
                        className={`rounded p-3 text-sm font-mono overflow-x-auto ${
                          testCase.passed
                            ? "bg-green-950/20 border border-green-600/20 text-green-300"
                            : "bg-red-950/20 border border-red-600/20 text-red-300"
                        }`}
                      >
                        {normalizeNewlines(testCase.actualOutput) || "(empty)"}
                      </div>
                    </div>

                    {/* Test Case Status Details */}
                    {testCase.statusId && (
                      <div className="pt-2 border-t border-white/[0.06] text-xs text-slate-400 space-y-1">
                        <p>Status: {testCase.statusDescription}</p>
                        {testCase.runtime && (
                          <p>Runtime: {testCase.runtime}</p>
                        )}
                        {testCase.memory && (
                          <p>Memory: {testCase.memory}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            {status === "error" ? "Unable to fetch test case details" : "No test cases available"}
          </div>
        )}
      </div>
    </div>
  );
}
