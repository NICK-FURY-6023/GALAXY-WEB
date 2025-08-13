// pages/privacy-policy.js

import Head from 'next/head';
import Link from 'next/link';

// Helper components for styling
const Highlight = ({ children }) => <span className="text-orange-400">{children}</span>;
const Keyword = ({ children }) => <span className="text-cyan-400 font-semibold">{children}</span>;

export default function PrivacyPolicyPage() {
    return (
        <>
            <Head>
                <title>GALAXY Bot | Privacy Policy</title>
            </Head>
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-primary dark:text-primary-dark text-center mb-8 font-mono">
                        <span className="text-green-500">Policy</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-cyan-500">privacy.md</span>
                    </h1>

                    <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-6 font-mono text-gray-300 text-base leading-loose">
                        
                        <div className="mb-6">
                            {/* Disclaimer text yahan se hata diya hai */}
                            <p><Keyword>const</Keyword> <Highlight>LAST_UPDATED</Highlight> = <span className="text-orange-400">"2025-07-08"</span>;</p>
                        </div>

                        <p className="mb-4 text-gray-500">// 1. Introduction</p>
                        <p className="mb-6 pl-4">
                            The use of the <Highlight>GALAXY</Highlight> application (<Highlight>"Bot"</Highlight>) and its associated website (<Highlight>"Website"</Highlight>) requires the collection of some user data (<Highlight>"Data"</Highlight>). Use of the Service is an agreement to this Policy.
                        </p>

                        <p className="mb-4 text-gray-500">// 2. Access to Data</p>
                        <p className="mb-6 pl-4">
                            Access to <Highlight>Data</Highlight> is restricted to the Bot's developer, <Highlight>NICK FURY</Highlight>, for development and testing. Data is <Keyword>not</Keyword> sold or shared with any third party, except where required by law.
                        </p>

                        <p className="mb-4 text-gray-500">// 3. Storage of Data</p>
                        <p className="mb-6 pl-4">
                            Data is stored in a secure <Highlight>MongoDB</Highlight> database. We take reasonable measures to protect data, but no guarantee is provided against a malicious breach.
                        </p>

                        <p className="mb-4 text-gray-500">// 4. User Rights</p>
                        <p className="mb-6 pl-4">
                            You have the right to request to view or delete your <Highlight>Data</Highlight>. Submit all requests through our official <Link href="https://discord.gg/U4kN6ZJyMt" target="_blank" className="text-blue-400 hover:underline">Support Server</Link>.
                        </p>

                        <p className="mb-4 text-gray-500">// 5. Underage Users</p>
                        <p className="mb-6 pl-4">
                            Use of the Service is <Keyword>not</Keyword> permitted for users under 13, in compliance with the <Link href="https://discord.com/terms" target="_blank" className="text-blue-400 hover:underline">Discord Terms of Service</Link>.
                        </p>

                        <p className="mb-4 text-gray-500">// 6. Questions</p>
                        <p className="mb-6 pl-4">
                            If you have questions, please contact <Highlight>NICK FURY</Highlight> on the Support Server.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}