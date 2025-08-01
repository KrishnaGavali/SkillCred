import React from "react";

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-start md:items-center text-left border-x border-b border-border-color mx-auto p-6 bg-background md:h-[80vh] md:justify-between space-y-6 md:space-y-0 w-full">
      {/* Text Section */}
      <div className="flex flex-col items-start justify-center w-full md:w-1/2 space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-black dark:text-white hidden md:block">
          SkillCred
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-white">
          Know Where You Stand. Improve What Matters.
        </h2>

        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-xl">
          Upload your resume and GitHub. Let AI show you what recruiters really
          see — with clear, personalized feedback and improvement paths.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition font-medium w-full sm:w-auto">
            Scan My Profile →
          </button>
          <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-muted transition font-medium w-full sm:w-auto">
            See Sample Report
          </button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          🚀 Already helping 50+ students stand out — join the next batch!
        </p>
      </div>

      {/* Placeholder or Video/Image Section */}
      <div
        className="w-full md:w-[35vw] min-w-[250px] aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
        id="vido"
      >
        {/* Replace this text with image/video element when ready */}
        <span className="text-gray-500 dark:text-gray-400">
          [Visual Preview]
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
