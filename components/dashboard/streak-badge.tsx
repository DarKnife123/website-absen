"use client";

type StreakBadgeProps = {
  consecutivePresent: number;
  consecutiveMissed: number;
};

export default function StreakBadge({ consecutivePresent, consecutiveMissed }: StreakBadgeProps) {
  // Show strike warning if student has missed days
  if (consecutiveMissed > 0) {
    return (
      <div className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200 rounded-2xl p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-start gap-4 relative">
            <div className="animate-strike text-4xl flex-shrink-0">
              ⚠️
            </div>
            <div>
              <h3 className="font-bold text-red-700 text-lg">
                Peringatan Ketidakhadiran!
              </h3>
              <p className="text-red-600 mt-1">
                Kamu sudah tidak hadir selama{" "}
                <span className="font-bold text-xl text-red-700">
                  {consecutiveMissed} hari
                </span>{" "}
                berturut-turut.
              </p>
              <p className="text-red-500/80 text-sm mt-2">
                Segera perbaiki kehadiranmu untuk menghindari konsekuensi lebih lanjut.
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-red-600">Strike Level</span>
              <span className="text-xs text-red-500">
                {consecutiveMissed >= 5 ? "KRITIS" : consecutiveMissed >= 3 ? "SERIUS" : "PERHATIAN"}
              </span>
            </div>
            <div className="h-2 bg-red-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((consecutiveMissed / 5) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`text-xs font-medium ${
                    consecutiveMissed >= n ? "text-red-600" : "text-red-300"
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show streak badge if 5+ consecutive days present
  if (consecutivePresent >= 5) {
    return (
      <div className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 border border-orange-200 rounded-2xl p-6 animate-pulse-glow relative overflow-hidden">
          {/* Glowing background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          
          <div className="flex items-center gap-4 relative">
            <div className="text-5xl animate-fire">🔥</div>
            <div>
              <h3 className="font-bold text-orange-700 text-lg flex items-center gap-2">
                Streak Kehadiran!
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  ON FIRE
                </span>
              </h3>
              <p className="text-orange-600 mt-1">
                Luar biasa! Kamu sudah hadir{" "}
                <span className="font-bold text-2xl text-orange-700">
                  {consecutivePresent} hari
                </span>{" "}
                berturut-turut! 🎉
              </p>
              <p className="text-orange-500/80 text-sm mt-1">
                Pertahankan semangat kehadiranmu!
              </p>
            </div>
          </div>

          {/* Streak dots */}
          <div className="flex gap-1.5 mt-4">
            {Array.from({ length: Math.min(consecutivePresent, 14) }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-amber-500"
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
            {consecutivePresent > 14 && (
              <span className="text-xs text-orange-500 font-medium ml-1 self-center">
                +{consecutivePresent - 14}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Neutral state - some attendance but less than 5 days streak
  if (consecutivePresent > 0) {
    return (
      <div className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <h3 className="font-semibold text-emerald-700">
                Kehadiran Berturut: {consecutivePresent} hari
              </h3>
              <p className="text-emerald-600 text-sm">
                {5 - consecutivePresent} hari lagi untuk mendapat streak! 🔥
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 mt-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`w-8 h-2 rounded-full ${
                  n <= consecutivePresent
                    ? "bg-emerald-500"
                    : "bg-emerald-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
