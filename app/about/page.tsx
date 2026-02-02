export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-gray-900 mb-4">
                        Curating the Vision. Defining the Space.
                    </h1>
                    <p className="text-lg text-gray-600">The Archer and Ash Story</p>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                    {/* Story Section */}
                    <section>
                        <p className="text-base leading-relaxed">
                            Founded in London in 2026 by Shehzad Khan, <span className="font-semibold">Archer and Ash</span> was born out of a simple observation: interior designers and decorators need more than just a marketplace—they need a source of inspiration.
                        </p>
                        <p className="text-base leading-relaxed">
                            In a world saturated with generic decor, finding that one "hero piece" that pulls a room together can be an exhaustive search. We built Archer and Ash to be the definitive shortcut for the creative professional. We provide a highly curated gallery of artwork designed to complement sophisticated aesthetics, whether you are styling a minimalist loft in Shoreditch or a classic townhouse in Mayfair.
                        </p>
                    </section>

                    {/* Philosophy Section */}
                    <section>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Philosophy</h2>
                        <p className="text-base leading-relaxed mb-6">
                            We believe that art shouldn't be an afterthought. It is the heartbeat of a well-designed room. Our collection is built on three core pillars:
                        </p>
                        <ul className="space-y-4 mb-6">
                            <li className="flex items-start">
                                <span className="flex-shrink-0 h-6 w-6 text-indigo-600 mr-3 mt-0.5">
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Curated Inspiration</h3>
                                    <p className="text-gray-600 mt-1">We don't just list art; we showcase how it lives within a space.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="flex-shrink-0 h-6 w-6 text-indigo-600 mr-3 mt-0.5">
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Design-First Focus</h3>
                                    <p className="text-gray-600 mt-1">Our platform is built specifically for the workflows of interior decorators and designers.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="flex-shrink-0 h-6 w-6 text-indigo-600 mr-3 mt-0.5">
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Style Versatility</h3>
                                    <p className="text-gray-600 mt-1">From bold contemporary abstracts to timeless textural pieces, our range is selected to suit diverse design languages.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* Why Choose Us */}
                    <section>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Why Designers Choose Us</h2>
                        <p className="text-base leading-relaxed">
                            At Archer and Ash, we understand that your reputation is built on the details. That's why we focus on quality, uniqueness, and ease of selection. We act as your silent partner, helping you source the visual elements that turn your clients' houses into homes.
                        </p>
                    </section>

                    {/* Quote Section */}
                    <section className="bg-indigo-50 border-l-4 border-indigo-600 px-6 py-8 rounded my-8">
                        <p className="text-lg text-gray-900 italic">
                            "Art is the soul of the home. Archer and Ash exists to help you find that soul, effortlessly."
                        </p>
                        <p className="text-gray-700 font-semibold mt-4">— Shehzad Khan, Founder</p>
                    </section>

                    {/* Call to Action Section */}
                    <section>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Let's Create Something Beautiful</h2>
                        <p className="text-base leading-relaxed mb-8">
                            Whether you are mid-moodboard or finishing a high-end residential project, we invite you to explore our latest collections. Let Archer and Ash be the place where your next great project begins.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/shop"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                            >
                                Browse the Collection
                            </a>
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center px-8 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                            >
                                Get in Touch
                            </a>
                        </div>
                    </section>

                    {/* Why 2026 Section */}
                    <section className="bg-gray-50 px-6 py-8 rounded">
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">The Modernity of Our Approach</h3>
                        <p className="text-base leading-relaxed">
                            Since launching in 2026, Archer and Ash leverages the latest digital tools to help designers visualize art in their projects. We combine London's rich design heritage with cutting-edge technology, making it easier than ever to source exceptional pieces that elevate every interior.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
