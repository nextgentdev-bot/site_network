import { useMemo, useState } from 'react';
import OrderModal from '../../components/Modal/AddToCart';

const TOTAL_SITES_COUNT = 1349; // পুরো network-এ মোট সাইট সংখ্যা (marketing number) — backend এলে API থেকে আসবে

const websites = [
    {
        name: 'Tipsytiaras.com',
        da: 45,
        dr: 72,
        authorityScore: 48,
        traffic: 135800,
        trafficLabel: '135.8K',
        niches: ['Travel', 'Fashion', 'Business', 'Entertainment'],
        backlinks: 2,
        keywords: 8200,
        dofollow: true,
        linkValidity: 'lifetime',
        sportsGaming: false,
        pharmacy: false,
        crypto: false,
        googleNews: true,
        sponsored: false,
        foreignLanguage: false,
        language: 'English',
        country: 'US',
        price: 25,
        addedAt: '2026-08-20',
    },
    {
        name: 'Grandpeoples.com',
        da: 41,
        dr: 80,
        authorityScore: 52,
        traffic: 134200,
        trafficLabel: '134.2K',
        niches: ['Business', 'Fitness', 'Lifestyle'],
        backlinks: 1,
        keywords: 5400,
        dofollow: true,
        linkValidity: '1year',
        sportsGaming: true,
        pharmacy: false,
        crypto: false,
        googleNews: false,
        sponsored: true,
        foreignLanguage: false,
        language: 'English',
        country: 'US',
        price: 45,
        addedAt: '2026-08-22',
    },
    {
        name: 'Dawishoo.in',
        da: 41,
        dr: 67,
        authorityScore: 39,
        traffic: 128800,
        trafficLabel: '128.8K',
        niches: ['General', 'News', 'Lifestyle'],
        backlinks: 2,
        keywords: 3100,
        dofollow: false,
        linkValidity: 'lifetime',
        sportsGaming: false,
        pharmacy: false,
        crypto: false,
        googleNews: true,
        sponsored: false,
        foreignLanguage: true,
        language: 'Hindi',
        country: 'IN',
        price: 30,
        addedAt: '2026-08-18',
    },
    {
        name: 'Idiominsider.com',
        da: 16,
        dr: 81,
        authorityScore: 61,
        traffic: 128000,
        trafficLabel: '128.0K',
        niches: ['Business', 'Finance', 'Fashion'],
        backlinks: 2,
        keywords: 9700,
        dofollow: true,
        linkValidity: '1year',
        sportsGaming: false,
        pharmacy: false,
        crypto: true,
        googleNews: false,
        sponsored: false,
        foreignLanguage: false,
        language: 'English',
        country: 'US',
        price: 45,
        addedAt: '2026-08-25',
    },
];

// প্রতিটা sort বাটন কোন field দিয়ে, কোন দিকে (asc/desc) sort করবে সেটা এখানে define করা
const FILTER_CONFIG = {
    'High DA': { key: 'da', direction: 'desc' },
    'High DR': { key: 'dr', direction: 'desc' },
    'High Traffic': { key: 'traffic', direction: 'desc' },
    Price: { key: 'price', direction: 'asc' },
    Newest: { key: 'addedAt', direction: 'desc' },
};

const sortLabels = ['High DA', 'High DR', 'High Traffic', 'Price', 'Newest'];

// popular chip ক্লিক করলে dropdown filter গুলোতে কী বসবে
const POPULAR_PRESETS = {
    'DA 50+': { da: '50+' },
    'DA 70+': { da: '70+' },
    'DR 50+': { dr: '50+' },
    '10K+ traffic': { traffic: '10k+' },
    'Under $100': { price: 'under100' },
    '$100–$500': { price: '100to500' },
    Dofollow: { linkType: 'dofollow' },
    'Google News': { googleNews: 'yes' },
};

const DEFAULT_DROPDOWN_FILTERS = {
    niche: 'all',
    da: 'any',
    dr: 'any',
    traffic: 'any',
    price: 'any',
    linkType: 'any',
    googleNews: 'any',
};

const DEFAULT_MORE_FILTERS = {
    language: 'all',
    country: 'all',
    authorityScore: 'any',
    keywords: 'any',
    backlinksCount: 'any',
    linkValidity: 'any',
    sportsGaming: 'any',
    pharmacy: 'any',
    crypto: 'any',
    sponsored: 'any',
    foreignLanguage: 'any',
    dateAdded: 'any',
};

const nicheOptions = ['All niches', ...new Set(websites.flatMap((s) => s.niches))];
const languageOptions = ['All languages', ...new Set(websites.map((s) => s.language))];
const countryOptions = ['All countries', ...new Set(websites.map((s) => s.country))];

const YesNoSelect = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
        >
            <option value="any" className="bg-[#1a1206]">Any</option>
            <option value="yes" className="bg-[#1a1206]">Yes</option>
            <option value="no" className="bg-[#1a1206]">No</option>
        </select>
    </div>
);

const WebsiteTable = () => {
    const [activeFilter, setActiveFilter] = useState('Newest'); // default sort: Newest
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(100);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [dropdownFilters, setDropdownFilters] = useState(DEFAULT_DROPDOWN_FILTERS);
    const [moreFilters, setMoreFilters] = useState(DEFAULT_MORE_FILTERS);

    const updateDropdownFilter = (key, value) => {
        setDropdownFilters((prev) => ({ ...prev, [key]: value }));
    };

    const updateMoreFilter = (key, value) => {
        setMoreFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyPopularPreset = (label) => {
        const preset = POPULAR_PRESETS[label];
        if (!preset) return;
        setDropdownFilters((prev) => ({ ...prev, ...preset }));
    };

    const clearAllFilters = () => {
        setDropdownFilters(DEFAULT_DROPDOWN_FILTERS);
        setMoreFilters(DEFAULT_MORE_FILTERS);
    };

    const [selectedSite, setSelectedSite] = useState(null); // কোন site-এর জন্য order modal খোলা আছে

    // OrderModal থেকে collect করা তথ্য এখানে আসে — এখন শুধু console এ দেখাচ্ছি,
    // পরে backend ready হলে এখানেই API call (fetch/axios) বসিয়ে দেওয়া যাবে
    const handleOrderSubmit = (order) => {
        console.log('New order collected:', order);
    };

    const visibleWebsites = useMemo(() => {
        const query = search.trim().toLowerCase();

        let result = websites.filter((site) => {
            // Search: name অথবা niche এর সাথে মিলিয়ে
            if (query) {
                const inName = site.name.toLowerCase().includes(query);
                const inNiche = site.niches.some((n) => n.toLowerCase().includes(query));
                if (!inName && !inNiche) return false;
            }

            // Niche
            if (dropdownFilters.niche !== 'all' && !site.niches.includes(dropdownFilters.niche)) return false;

            // DA
            if (dropdownFilters.da === '50+' && site.da < 50) return false;
            if (dropdownFilters.da === '70+' && site.da < 70) return false;

            // DR
            if (dropdownFilters.dr === '50+' && site.dr < 50) return false;
            if (dropdownFilters.dr === '70+' && site.dr < 70) return false;

            // Traffic
            if (dropdownFilters.traffic === '10k+' && site.traffic < 10000) return false;
            if (dropdownFilters.traffic === '50k+' && site.traffic < 50000) return false;
            if (dropdownFilters.traffic === '100k+' && site.traffic < 100000) return false;

            // Price
            if (dropdownFilters.price === 'under100' && site.price >= 100) return false;
            if (dropdownFilters.price === '100to500' && (site.price < 100 || site.price > 500)) return false;
            if (dropdownFilters.price === '500plus' && site.price <= 500) return false;

            // Link type (dofollow/nofollow)
            if (dropdownFilters.linkType === 'dofollow' && !site.dofollow) return false;
            if (dropdownFilters.linkType === 'nofollow' && site.dofollow) return false;

            // Google News
            if (dropdownFilters.googleNews === 'yes' && !site.googleNews) return false;
            if (dropdownFilters.googleNews === 'no' && site.googleNews) return false;

            // --- More filters ---
            if (moreFilters.language !== 'all' && site.language !== moreFilters.language) return false;
            if (moreFilters.country !== 'all' && site.country !== moreFilters.country) return false;

            if (moreFilters.authorityScore === '50+' && site.authorityScore < 50) return false;
            if (moreFilters.authorityScore === '70+' && site.authorityScore < 70) return false;

            if (moreFilters.keywords === '1000+' && site.keywords < 1000) return false;
            if (moreFilters.keywords === '5000+' && site.keywords < 5000) return false;

            if (moreFilters.backlinksCount === '1+' && site.backlinks < 1) return false;
            if (moreFilters.backlinksCount === '2+' && site.backlinks < 2) return false;

            if (moreFilters.linkValidity !== 'any' && site.linkValidity !== moreFilters.linkValidity) return false;

            if (moreFilters.sportsGaming === 'yes' && !site.sportsGaming) return false;
            if (moreFilters.sportsGaming === 'no' && site.sportsGaming) return false;

            if (moreFilters.pharmacy === 'yes' && !site.pharmacy) return false;
            if (moreFilters.pharmacy === 'no' && site.pharmacy) return false;

            if (moreFilters.crypto === 'yes' && !site.crypto) return false;
            if (moreFilters.crypto === 'no' && site.crypto) return false;

            if (moreFilters.sponsored === 'yes' && !site.sponsored) return false;
            if (moreFilters.sponsored === 'no' && site.sponsored) return false;

            if (moreFilters.foreignLanguage === 'yes' && !site.foreignLanguage) return false;
            if (moreFilters.foreignLanguage === 'no' && site.foreignLanguage) return false;

            if (moreFilters.dateAdded !== 'any') {
                const daysAgo = (Date.now() - new Date(site.addedAt).getTime()) / (1000 * 60 * 60 * 24);
                if (moreFilters.dateAdded === '7days' && daysAgo > 7) return false;
                if (moreFilters.dateAdded === '30days' && daysAgo > 30) return false;
            }

            return true;
        });

        // Sort
        const config = FILTER_CONFIG[activeFilter];
        if (config) {
            result = [...result].sort((a, b) => {
                const aVal = a[config.key];
                const bVal = b[config.key];
                if (aVal < bVal) return config.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return config.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result.slice(0, perPage);
    }, [search, activeFilter, perPage, dropdownFilters, moreFilters]);

    return (
        <div className="bg-[#0a1128] min-h-screen">
            {/* --- Banner --- */}
            <div className="px-4 sm:px-6 py-12 sm:py-20 text-center">
                <h1 className="text-3xl font-extrabold text-orange-400 sm:text-5xl md:text-6xl">
                    Browse our premium site network
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
                    Fast, affordable, high-quality contextual guest posts with dofollow
                    backlinks from authority sites in every niche.
                </p>
            </div>

            {/* --- Filter bar + Table wrapper --- */}
            <div className="mx-2 sm:mx-4 rounded-xl bg-[#1a1206] border border-orange-900/30 overflow-hidden">

                {/* Filter bar */}
                <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/10">
                    <div className="flex-1 min-w-[220px] relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by website URL or niche"
                            className="w-full rounded-lg bg-transparent border border-white/20 pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilterPanel((prev) => !prev)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                            showFilterPanel
                                ? 'bg-orange-400 text-black border-orange-400'
                                : 'border-white/20 text-gray-200 hover:border-white/40'
                        }`}
                    >
                        ☰ Filters
                    </button>

                    {sortLabels.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                                activeFilter === f
                                    ? 'bg-orange-400 text-black border-orange-400'
                                    : 'border-white/20 text-gray-200 hover:border-white/40'
                            }`}
                        >
                            {f}
                        </button>
                    ))}

                    <div className="flex items-center gap-2 text-sm text-gray-300 ml-auto">
                        <span>Per page</span>
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(Number(e.target.value))}
                            className="bg-transparent border border-white/20 rounded-lg px-2 py-1 text-gray-200 focus:outline-none"
                        >
                            <option value={100}>100</option>
                            <option value={50}>50</option>
                            <option value={25}>25</option>
                        </select>
                    </div>
                </div>

                {/* --- Expandable filter panel --- */}
                {showFilterPanel && (
                    <div className="p-4 border-b border-white/10 space-y-5">
                        {/* Popular chips */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-orange-400 text-xs font-bold tracking-wide">POPULAR</span>
                            {Object.keys(POPULAR_PRESETS).map((label) => {
                                const preset = POPULAR_PRESETS[label];
                                const isActive = Object.entries(preset).every(
                                    ([key, value]) => dropdownFilters[key] === value
                                );
                                return (
                                    <button
                                        key={label}
                                        onClick={() => applyPopularPreset(label)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                                            isActive
                                                ? 'bg-orange-400 text-black border-orange-400'
                                                : 'border-white/20 text-gray-200 hover:border-white/40'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Row 1: main dropdown filters */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Niche</label>
                                <select
                                    value={dropdownFilters.niche}
                                    onChange={(e) => updateDropdownFilter('niche', e.target.value)}
                                    className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                >
                                    {nicheOptions.map((n) => (
                                        <option key={n} value={n === 'All niches' ? 'all' : n} className="bg-[#1a1206]">{n}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">DA</label>
                                <select
                                    value={dropdownFilters.da}
                                    onChange={(e) => updateDropdownFilter('da', e.target.value)}
                                    className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                >
                                    <option value="any" className="bg-[#1a1206]">Any</option>
                                    <option value="50+" className="bg-[#1a1206]">50+</option>
                                    <option value="70+" className="bg-[#1a1206]">70+</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">DR</label>
                                <select
                                    value={dropdownFilters.dr}
                                    onChange={(e) => updateDropdownFilter('dr', e.target.value)}
                                    className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                >
                                    <option value="any" className="bg-[#1a1206]">Any</option>
                                    <option value="50+" className="bg-[#1a1206]">50+</option>
                                    <option value="70+" className="bg-[#1a1206]">70+</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Traffic</label>
                                <select
                                    value={dropdownFilters.traffic}
                                    onChange={(e) => updateDropdownFilter('traffic', e.target.value)}
                                    className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                >
                                    <option value="any" className="bg-[#1a1206]">Any</option>
                                    <option value="10k+" className="bg-[#1a1206]">10K+</option>
                                    <option value="50k+" className="bg-[#1a1206]">50K+</option>
                                    <option value="100k+" className="bg-[#1a1206]">100K+</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Price</label>
                                <select
                                    value={dropdownFilters.price}
                                    onChange={(e) => updateDropdownFilter('price', e.target.value)}
                                    className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                >
                                    <option value="any" className="bg-[#1a1206]">Any price</option>
                                    <option value="under100" className="bg-[#1a1206]">Under $100</option>
                                    <option value="100to500" className="bg-[#1a1206]">$100–$500</option>
                                    <option value="500plus" className="bg-[#1a1206]">Over $500</option>
                                </select>
                            </div>
                        </div>

                        {/* More filters toggle */}
                        <button
                            onClick={() => setShowMoreFilters((prev) => !prev)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-400 text-orange-400 text-sm font-semibold hover:bg-orange-400/10"
                        >
                            <span className="w-5 h-5 rounded-full bg-orange-400 text-black flex items-center justify-center text-xs">
                                {showMoreFilters ? '✕' : '+'}
                            </span>
                            More filters
                        </button>

                        {/* --- Extra filter rows (More filters) --- */}
                        {showMoreFilters && (
                            <div className="space-y-4 pt-2 border-t border-white/10">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Language</label>
                                        <select
                                            value={moreFilters.language}
                                            onChange={(e) => updateMoreFilter('language', e.target.value)}
                                            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                        >
                                            {languageOptions.map((l) => (
                                                <option key={l} value={l === 'All languages' ? 'all' : l} className="bg-[#1a1206]">{l}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Country</label>
                                        <select
                                            value={moreFilters.country}
                                            onChange={(e) => updateMoreFilter('country', e.target.value)}
                                            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                        >
                                            {countryOptions.map((c) => (
                                                <option key={c} value={c === 'All countries' ? 'all' : c} className="bg-[#1a1206]">{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Authority Score (AS)</label>
                                        <select
                                            value={moreFilters.authorityScore}
                                            onChange={(e) => updateMoreFilter('authorityScore', e.target.value)}
                                            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                        >
                                            <option value="any" className="bg-[#1a1206]">Any</option>
                                            <option value="50+" className="bg-[#1a1206]">50+</option>
                                            <option value="70+" className="bg-[#1a1206]">70+</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Keywords</label>
                                        <select
                                            value={moreFilters.keywords}
                                            onChange={(e) => updateMoreFilter('keywords', e.target.value)}
                                            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                        >
                                            <option value="any" className="bg-[#1a1206]">Any</option>
                                            <option value="1000+" className="bg-[#1a1206]">1,000+</option>
                                            <option value="5000+" className="bg-[#1a1206]">5,000+</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">No. of backlinks</label>
                                        <select
                                            value={moreFilters.backlinksCount}
                                            onChange={(e) => updateMoreFilter('backlinksCount', e.target.value)}
                                            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                        >
                                            <option value="any" className="bg-[#1a1206]">Any</option>
                                            <option value="1+" className="bg-[#1a1206]">1+</option>
                                            <option value="2+" className="bg-[#1a1206]">2+</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Link Type</label>
                                        <select
                                            value={dropdownFilters.linkType}
                                            onChange={(e) => updateDropdownFilter('linkType', e.target.value)}
                                            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                        >
                                            <option value="any" className="bg-[#1a1206]">Any</option>
                                            <option value="dofollow" className="bg-[#1a1206]">Dofollow</option>
                                            <option value="nofollow" className="bg-[#1a1206]">Nofollow</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Link Validity</label>
                                        <select
                                            value={moreFilters.linkValidity}
                                            onChange={(e) => updateMoreFilter('linkValidity', e.target.value)}
                                            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                        >
                                            <option value="any" className="bg-[#1a1206]">Any</option>
                                            <option value="lifetime" className="bg-[#1a1206]">Lifetime</option>
                                            <option value="1year" className="bg-[#1a1206]">1 Year</option>
                                        </select>
                                    </div>

                                    <YesNoSelect label="Sports / Gaming" value={moreFilters.sportsGaming} onChange={(v) => updateMoreFilter('sportsGaming', v)} />
                                    <YesNoSelect label="Pharmacy" value={moreFilters.pharmacy} onChange={(v) => updateMoreFilter('pharmacy', v)} />
                                    <YesNoSelect label="Crypto" value={moreFilters.crypto} onChange={(v) => updateMoreFilter('crypto', v)} />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    <YesNoSelect label="Google News" value={dropdownFilters.googleNews} onChange={(v) => updateDropdownFilter('googleNews', v)} />
                                    <YesNoSelect label="Marked Sponsored" value={moreFilters.sponsored} onChange={(v) => updateMoreFilter('sponsored', v)} />
                                    <YesNoSelect label="Foreign language" value={moreFilters.foreignLanguage} onChange={(v) => updateMoreFilter('foreignLanguage', v)} />

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Date added</label>
                                        <select
                                            value={moreFilters.dateAdded}
                                            onChange={(e) => updateMoreFilter('dateAdded', e.target.value)}
                                            className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                        >
                                            <option value="any" className="bg-[#1a1206]">Any time</option>
                                            <option value="7days" className="bg-[#1a1206]">Last 7 days</option>
                                            <option value="30days" className="bg-[#1a1206]">Last 30 days</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty state (desktop + mobile উভয় জায়গায় একই) */}
                {visibleWebsites.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
                        <p className="text-gray-400 text-lg font-semibold">No sites match your filters.</p>
                        <button
                            onClick={clearAllFilters}
                            className="px-5 py-2 rounded-lg bg-white/5 border border-white/15 text-gray-200 text-sm font-semibold hover:bg-white/10"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* --- Desktop / tablet: grid table, horizontally scrollable if needed --- */}
                {visibleWebsites.length > 0 && (
                    <div className="hidden md:block overflow-x-auto">
                        <div className="min-w-[880px]">
                            {/* Table header */}
                            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_2fr_1fr_1fr_auto] gap-4 px-6 py-3 text-xs text-gray-400 font-semibold border-b border-white/10">
                                <span>WEBSITE</span>
                                <span className="text-blue-400">MOZ<br />DA</span>
                                <span className="text-orange-400">AHREFS<br />DR</span>
                                <span className="text-orange-400">AHREFS<br />TRAFFIC</span>
                                <span>NICHE</span>
                                <span>BACKLINKS</span>
                                <span>PRICE</span>
                                <span></span>
                            </div>

                            {visibleWebsites.map((site) => (
                                <div
                                    key={site.name}
                                    className="grid grid-cols-[2fr_1fr_1fr_1fr_2fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 border-b border-white/5 hover:bg-white/5"
                                >
                                    <div className="flex items-center gap-2 text-white font-semibold">
                                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">🌐</span>
                                        {site.name}
                                    </div>

                                    <div>
                                        <div className="text-green-400 font-bold">{site.da}</div>
                                        <div className="h-1 w-10 bg-green-400/60 rounded mt-1" />
                                    </div>

                                    <div>
                                        <div className="text-green-400 font-bold">{site.dr}</div>
                                        <div className="h-1 w-10 bg-green-400/60 rounded mt-1" />
                                    </div>

                                    <div className="text-white">{site.trafficLabel}</div>

                                    <div className="flex flex-wrap gap-1">
                                        {site.niches.map((n) => (
                                            <span key={n} className="px-2 py-0.5 rounded bg-white/10 text-xs text-gray-300">{n}</span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">{site.backlinks}</span>
                                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold">
                                            {site.dofollow ? 'DOFOLLOW' : 'NOFOLLOW'}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="text-white font-bold">${site.price}</div>
                                        <div className="text-xs text-gray-500">PER POST</div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedSite(site)}
                                        className="flex items-center gap-1 bg-orange-400 text-black text-sm font-semibold px-3 py-2 rounded-lg hover:bg-orange-300"
                                    >
                                        🛒 Add to order
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Mobile: stacked card layout --- */}
                {visibleWebsites.length > 0 && (
                    <div className="md:hidden divide-y divide-white/5">
                        {visibleWebsites.map((site) => (
                            <div key={site.name} className="p-4 space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-white font-semibold min-w-0">
                                        <span className="w-6 h-6 shrink-0 rounded-full bg-white/10 flex items-center justify-center">🌐</span>
                                        <span className="truncate">{site.name}</span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-white font-bold">${site.price}</div>
                                        <div className="text-[10px] text-gray-500">PER POST</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="rounded-lg bg-white/5 py-2">
                                        <div className="text-[10px] text-blue-400">MOZ DA</div>
                                        <div className="text-green-400 font-bold">{site.da}</div>
                                    </div>
                                    <div className="rounded-lg bg-white/5 py-2">
                                        <div className="text-[10px] text-orange-400">AHREFS DR</div>
                                        <div className="text-green-400 font-bold">{site.dr}</div>
                                    </div>
                                    <div className="rounded-lg bg-white/5 py-2">
                                        <div className="text-[10px] text-orange-400">TRAFFIC</div>
                                        <div className="text-white font-bold">{site.trafficLabel}</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {site.niches.map((n) => (
                                        <span key={n} className="px-2 py-0.5 rounded bg-white/10 text-xs text-gray-300">{n}</span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-white text-sm font-semibold">{site.backlinks} backlinks</span>
                                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold">
                                        {site.dofollow ? 'DOFOLLOW' : 'NOFOLLOW'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setSelectedSite(site)}
                                    className="w-full flex items-center justify-center gap-1 bg-orange-400 text-black text-sm font-semibold px-3 py-2 rounded-lg hover:bg-orange-300"
                                >
                                    🛒 Add to order
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- Footer bar --- */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-6 py-4 bg-[#0f1c3a] text-center sm:text-left">
                    <span className="text-gray-300 text-sm">
                        Showing {visibleWebsites.length} of {TOTAL_SITES_COUNT.toLocaleString()} sites
                    </span>
                    <a
                        href="https://gposting.com/contact"
                        className="text-orange-400 text-sm font-semibold hover:underline"
                    >
                        Can't find a site? Request a custom quote →
                    </a>
                </div>
            </div>

            {selectedSite && (
                <OrderModal
                    site={selectedSite}
                    onClose={() => setSelectedSite(null)}
                    onSubmit={handleOrderSubmit}
                />
            )}
        </div>
    );
};

export default WebsiteTable;