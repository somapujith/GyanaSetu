import { Bell, Upload, Download, Star, TrendingUp, Calendar, Mail, User, Award, Trophy, Sparkles, Target } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-800 backdrop-blur-sm bg-[#0a0a0a]/80 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-purple-500/50">
            <span className="text-xs font-bold">G</span>
          </div>
          <span className="font-semibold">GyanaSetu</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-all duration-300 hover:scale-110 group">
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          </button>
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer hover:scale-110">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Profile Section */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-purple-500 flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl shadow-purple-500/30 group-hover:shadow-purple-500/60">
                <User className="w-12 h-12 text-gray-400 group-hover:text-gray-300 transition-colors" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-[#0a0a0a] group-hover:scale-125 transition-transform cursor-pointer shadow-lg shadow-purple-500/50">
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Priya Sharma</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30 hover:bg-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer hover:scale-105">
                      Computer Science
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs border border-cyan-500/30 hover:bg-cyan-500/30 hover:border-cyan-400/50 transition-all cursor-pointer hover:scale-105">
                      2nd Year
                    </span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs border border-pink-500/30 hover:bg-pink-500/30 hover:border-pink-400/50 transition-all cursor-pointer hover:scale-105">
                      MVJCE
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-2 hover:text-gray-300 transition-colors cursor-pointer">
                      <Mail className="w-4 h-4" />
                      <span>priya.sharma@college.edu</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span>Joined Dec 2024</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 max-w-2xl">
                    Passionate about sharing knowledge and helping fellow students succeed. Active contributor in Computer Science resources.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-all border border-gray-700 hover:border-gray-600 hover:scale-105 hover:shadow-lg">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 relative overflow-hidden group">
                    <span className="relative z-10">Share</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all group-hover:shadow-lg group-hover:shadow-purple-500/50">
                <Upload className="w-5 h-5 text-purple-400 group-hover:text-purple-300 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="text-2xl font-semibold mb-1 group-hover:text-purple-300 transition-colors">23</div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Resources Shared</div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 group">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-cyan-500/30 group-hover:scale-110 transition-all group-hover:shadow-lg group-hover:shadow-cyan-500/50">
                <Download className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-y-1 transition-all" />
              </div>
              <div className="text-2xl font-semibold mb-1 group-hover:text-cyan-300 transition-colors">156</div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Downloads</div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5 hover:border-pink-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 group">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-pink-500/30 group-hover:scale-110 transition-all group-hover:shadow-lg group-hover:shadow-pink-500/50">
                <Star className="w-5 h-5 text-pink-400 group-hover:text-pink-300 group-hover:rotate-12 transition-all" />
              </div>
              <div className="text-2xl font-semibold mb-1 group-hover:text-pink-300 transition-colors">450</div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Reactions</div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all group-hover:shadow-lg group-hover:shadow-purple-500/50">
                <TrendingUp className="w-5 h-5 text-purple-400 group-hover:text-purple-300 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="text-2xl font-semibold mb-1 group-hover:text-purple-300 transition-colors">89</div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Contributions</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Activity - Left Column (2/3) */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg">Recent Activity</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all group-hover:shadow-lg group-hover:shadow-purple-500/50">
                    <Upload className="w-5 h-5 text-purple-400 group-hover:text-purple-300 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium mb-1 group-hover:text-purple-300 transition-colors">Data Structures - Binary Trees Notes</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="group-hover:text-gray-300 transition-colors">2 hours ago</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 group-hover:text-gray-300 transition-colors">
                        <Eye className="w-3 h-3" />
                        45 views
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/30 group-hover:scale-110 transition-all group-hover:shadow-lg group-hover:shadow-cyan-500/50">
                    <Download className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-y-0.5 transition-all" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium mb-1 group-hover:text-cyan-300 transition-colors">Machine Learning Assignment 3</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="group-hover:text-gray-300 transition-colors">5 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all group-hover:shadow-lg group-hover:shadow-purple-500/50">
                    <Upload className="w-5 h-5 text-purple-400 group-hover:text-purple-300 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium mb-1 group-hover:text-purple-300 transition-colors">Computer Networks Lab Manual</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="group-hover:text-gray-300 transition-colors">1 day ago</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 group-hover:text-gray-300 transition-colors">
                        <Eye className="w-3 h-3" />
                        78 views
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-pink-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/10 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/30 group-hover:scale-110 transition-all group-hover:shadow-lg group-hover:shadow-pink-500/50">
                    <Upload className="w-5 h-5 text-pink-400 group-hover:text-pink-300 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium mb-1 group-hover:text-pink-300 transition-colors">Database Management System PPT</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="group-hover:text-gray-300 transition-colors">2 days ago</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 group-hover:text-gray-300 transition-colors">
                        <Eye className="w-3 h-3" />
                        34 views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements - Right Column (1/3) */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg">Achievements</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-pink-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-pink-500/20 group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform group-hover:shadow-lg group-hover:shadow-pink-500/50 group-hover:rotate-6">
                    <Award className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-pink-300 transition-colors">Early Adopter</h3>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Unlocked</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform group-hover:shadow-lg group-hover:shadow-cyan-500/50 group-hover:rotate-6">
                    <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-cyan-300 transition-colors">Top Contributor</h3>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Unlocked</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform group-hover:shadow-lg group-hover:shadow-purple-500/50 group-hover:rotate-6">
                    <Star className="w-6 h-6 group-hover:scale-110 transition-transform group-hover:rotate-12" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-purple-300 transition-colors">Helpful</h3>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Unlocked</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform group-hover:shadow-lg group-hover:shadow-cyan-500/50 group-hover:rotate-6">
                    <Target className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-cyan-300 transition-colors">Knowledge Sharer</h3>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Unlocked</p>
                  </div>
                </div>
              </div>

              {/* Next Badge Progress */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 mt-4 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium group-hover:text-purple-300 transition-colors">Next Badge</h3>
                  <span className="text-xs text-purple-400 group-hover:text-purple-300 transition-colors">85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-purple-500/50 relative overflow-hidden" style={{ width: '85%' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                  Upload 3 more resources to unlock "Knowledge Leader"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Eye icon component (simple implementation)
function Eye({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}