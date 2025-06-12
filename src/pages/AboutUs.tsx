export function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About DROIDFORG3D</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing the intersection of artificial intelligence and 3D manufacturing, 
            making it possible for anyone to transform their ideas into physical reality through 
            fully automated processes.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Visionary Behind DroidForge 3D</h3>
                <p className="text-gray-600 text-sm italic">
                  "Building the future of automated manufacturing, one print at a time."
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Russell</h2>
              <p className="text-lg text-gray-600 mb-6">
                DroidForge 3D is the brainchild of Russell, a Texas-based technologist and creative entrepreneur 
                with a Bachelor’s degree in Computer Animation and an A+ certification. His journey into the 
                world of AI began in early 2023, sparked by the incredible potential of generative LLMs. 
                This ignited a passion that borders on obsession, driving him to constantly explore and 
                innovate within the rapidly evolving AI landscape.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Russell's expertise lies at the intersection of AI and 3D modeling. He's a seasoned developer 
                and a certified computer technician, further bolstered by an AI Boot Camp certificate from SMU, 
                where he graduated with an A+ grade. Beyond his professional pursuits, Russell is an avid 
                3D printing hobbyist, with a particular soft spot for bringing beloved superheroes, anime, 
                and horror characters to life through his prints.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                His dedication to AI is what fuels the automated nature of DroidForge 3D. By building 
                businesses that operate autonomously, Russell can dedicate his focus to advancing AI, 
                while ensuring DroidForge 3D delivers unparalleled results, convenience, and fun to its users. 
                Every automated process is closely monitored, ensuring the highest quality and reliability.
              </p>
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Core Expertise:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Artificial Intelligence & Machine Learning
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    3D Modeling & Animation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Business Automation & Scalable Solutions
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Precision 3D Printing & Manufacturing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At DROIDFORG3D, we believe that creativity shouldn't be limited by technical barriers 
                or traditional business hours. Our mission is to democratize 3D design and manufacturing 
                by combining the power of artificial intelligence with precision 3D printing in a 
                completely automated ecosystem.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Whether you're a professional designer, hobbyist, or someone with a great idea, 
                we provide the tools and services to bring your vision to life – automatically, 
                efficiently, and at any time of day.
              </p>
              <div className="bg-orange-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">The Automated Advantage:</h4>
                <p className="text-gray-600">
                  Our platform operates continuously, processing orders, generating designs, and 
                  coordinating manufacturing without downtime. This means faster turnaround times, 
                  consistent quality, and scalable production that grows with demand.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Automation First</h3>
                <p className="text-gray-600">
                  Pushing the boundaries of what's possible with fully automated AI-driven 
                  manufacturing and business operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide our automated future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m9-9H3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessibility</h3>
              <p className="text-gray-600">
                Making advanced 3D design and manufacturing accessible to everyone, 24/7.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality</h3>
              <p className="text-gray-600">
                Delivering exceptional quality through consistent automated processes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">
                Building a vibrant community of creators and innovators.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                Continuously pushing the boundaries of automated manufacturing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our AI Team</h2>
            <p className="text-xl text-gray-600">
              The artificial intelligence specialists that power our automated platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
              <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Droid</h3>
              <p className="text-gray-600 mb-6">
                Our AI Model Generator operates 24/7, transforming natural language descriptions into 
                detailed 3D models. Trained on millions of designs, Droid understands both artistic 
                vision and engineering requirements, working continuously to process design requests.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Specialization:</span>
                  <span className="font-semibold">Automated 3D Design</span>
                </div>
                <div className="flex justify-between">
                  <span>Training Data:</span>
                  <span className="font-semibold">10M+ Models</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className="font-semibold">24/7 Operation</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 text-center">
              <div className="w-32 h-32 bg-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Forge</h3>
              <p className="text-gray-600 mb-6">
                Our automated 3D Manufacturing Specialist optimizes models for production, selects 
                materials, coordinates with printing facilities, and ensures quality control. Forge 
                operates continuously, managing the entire manufacturing pipeline without human intervention.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Specialization:</span>
                  <span className="font-semibold">Automated Manufacturing</span>
                </div>
                <div className="flex justify-between">
                  <span>Materials:</span>
                  <span className="font-semibold">15+ Types</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality Control:</span>
                  <span className="font-semibold">100% Automated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">The Future is Automated</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            DroidForge 3D represents the next evolution of business – where artificial intelligence 
            handles operations, creativity meets automation, and innovation never sleeps. We're not 
            just building a 3D printing service; we're pioneering the future of autonomous business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300">Continuous Operation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">100%</div>
              <div className="text-gray-300">Automated Workflow</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
              <div className="text-gray-300">Scalable Potential</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

