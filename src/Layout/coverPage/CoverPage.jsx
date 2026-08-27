
const CoverPage = () => {
    return (
            <div className="relative overflow-hidden bg-[#12161F] px-6 py-30 text-center">
                    {/* subtle glow background */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,140,0,0.15),transparent_60%)]" />

                <div className="relative z-10 mx-auto max-w-4xl">
                      <p className="mb-4 text-sm text-gray-400">
                    <span className="text-orange-400">Home</span> › Websites
                   </p>

                   <h1 className="text-4xl font-bold text-orange-400 sm:text-5xl md:text-5xl">
                    Browse our premium site network
                   </h1>

                   <p className="mt-6 text-lg text-gray-300">
                    Fast, affordable, high-quality contextual guest posts with dofollow
                    backlinks from authority sites in every niche.
                   </p>
               </div>
              </div> 
           );
};

export default CoverPage;