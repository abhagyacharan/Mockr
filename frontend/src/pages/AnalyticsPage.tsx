// {
//   activeTab === "analytics" && (
//     <div className="space-y-6">
//       {/* Performance Overview */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="rounded-lg border bg-card text-card-foreground shadow-sm border-gray-200">
//           <div className="flex flex-col space-y-1.5 p-6">
//             <h3 className="text-2xl font-semibold leading-none tracking-tight">
//               Performance Trend
//             </h3>
//           </div>
//           <div className="p-6 pt-0">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Average Score</span>
//                 <span className="font-semibold">
//                   {performanceMetrics.averageScore}%
//                 </span>
//               </div>
//               <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
//                 <div
//                   className="h-full w-full flex-1 transition-all bg-blue-600"
//                   style={{
//                     transform: `translateX(-${
//                       100 - performanceMetrics.averageScore
//                     }%)`,
//                   }}
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Improvement Rate</span>
//                 <span className="font-semibold text-green-600">
//                   +{performanceMetrics.improvementRate}%
//                 </span>
//               </div>
//               <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
//                 <div
//                   className="h-full w-full flex-1 transition-all bg-green-600"
//                   style={{
//                     transform: `translateX(-${
//                       100 - performanceMetrics.improvementRate
//                     }%)`,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="rounded-lg border bg-card text-card-foreground shadow-sm border-gray-200">
//           <div className="flex flex-col space-y-1.5 p-6">
//             <h3 className="text-2xl font-semibold leading-none tracking-tight">
//               Score Distribution
//             </h3>
//           </div>
//           <div className="p-6 pt-0">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">
//                   Excellent (80-100%)
//                 </span>
//                 <span className="font-semibold">4 sessions</span>
//               </div>
//               <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
//                 <div
//                   className="h-full w-full flex-1 transition-all bg-green-600"
//                   style={{ transform: `translateX(-${100 - 33}%)` }}
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Good (60-79%)</span>
//                 <span className="font-semibold">6 sessions</span>
//               </div>
//               <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
//                 <div
//                   className="h-full w-full flex-1 transition-all bg-yellow-600"
//                   style={{ transform: `translateX(-${100 - 50}%)` }}
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">
//                   Needs Work (0-59%)
//                 </span>
//                 <span className="font-semibold">2 sessions</span>
//               </div>
//               <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
//                 <div
//                   className="h-full w-full flex-1 transition-all bg-red-600"
//                   style={{ transform: `translateX(-${100 - 17}%)` }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Strengths and Areas for Improvement */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="rounded-lg border bg-card text-card-foreground shadow-sm border-gray-200">
//           <div className="flex flex-col space-y-1.5 p-6">
//             <h3 className="text-2xl font-semibold leading-none tracking-tight text-green-600">
//               Strong Areas
//             </h3>
//           </div>
//           <div className="p-6 pt-0">
//             <div className="space-y-3">
//               {performanceMetrics.strongAreas.map((area, index) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span className="text-gray-700">{area}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="rounded-lg border bg-card text-card-foreground shadow-sm border-gray-200">
//           <div className="flex flex-col space-y-1.5 p-6">
//             <h3 className="text-2xl font-semibold leading-none tracking-tight text-orange-600">
//               Areas for Improvement
//             </h3>
//           </div>
//           <div className="p-6 pt-0">
//             <div className="space-y-3">
//               {performanceMetrics.improvementAreas.map((area, index) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                   <span className="text-gray-700">{area}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recommendations */}
//       <div className="rounded-lg border bg-card text-card-foreground shadow-sm border-gray-200">
//         <div className="flex flex-col space-y-1.5 p-6">
//           <h3 className="text-2xl font-semibold leading-none tracking-tight">
//             Personalized Recommendations
//           </h3>
//         </div>
//         <div className="p-6 pt-0">
//           <div className="space-y-4">
//             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <h4 className="font-medium text-blue-900 mb-2">
//                 Focus on System Design
//               </h4>
//               <p className="text-blue-800 text-sm">
//                 Your scores in system design questions are below average.
//                 Consider practicing with more complex architecture problems.
//               </p>
//             </div>
//             <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//               <h4 className="font-medium text-green-900 mb-2">
//                 Maintain Technical Strength
//               </h4>
//               <p className="text-green-800 text-sm">
//                 You're performing excellently in technical questions. Keep up
//                 the good work and continue practicing regularly.
//               </p>
//             </div>
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <h4 className="font-medium text-yellow-900 mb-2">
//                 Improve Behavioral Responses
//               </h4>
//               <p className="text-yellow-800 text-sm">
//                 Work on structuring your behavioral answers using the STAR
//                 method (Situation, Task, Action, Result).
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
