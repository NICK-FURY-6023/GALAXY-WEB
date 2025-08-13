// pages/terms-and-conditions.js

import Head from 'next/head';
import Link from 'next/link';

// Helper components for styling
const Highlight = ({ children }) => <span className="text-orange-400">{children}</span>;
const Keyword = ({ children }) => <span className="text-cyan-400 font-semibold">{children}</span>;

export default function TermsAndConditionsPage() {
    return (
        <>
            <Head>
                <title>GALAXY Bot | Terms & Conditions</title>
            </Head>
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-primary dark:text-primary-dark text-center mb-8 font-mono">
                        <span className="text-green-500">Docs</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-cyan-500">terms.md</span>
                    </h1>

                    <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-6 font-mono text-gray-300 text-base leading-loose">
                        
                        <div className="mb-6">
                            <p><Keyword>const</Keyword> <Highlight>LAST_UPDATED</Highlight> = <span className="text-orange-400">"2025-07-08"</span>;</p>
                        </div>

                        <p className="mb-4 text-gray-500">// 1. Acceptance of Terms</p>
                        <p className="mb-6 pl-4">
                            By inviting the <Highlight>GALAXY</Highlight> bot or using its associated <Highlight>Website</Highlight> (the <Highlight>"Service"</Highlight>), you agree to be bound by these Terms and Conditions.
                        </p>

                        <p className="mb-4 text-gray-500">// 2. Use of the Service</p>
                        <p className="mb-6 pl-4">
                            You agree to use the Service in compliance with all applicable laws and the <Link href="https://discord.com/terms" target="_blank" className="text-blue-400 hover:underline">Discord Terms of Service</Link>. You are responsible for your conduct.
                        </p>

                        <p className="mb-4 text-gray-500">// 3. Prohibited Activities</p>
                        <p className="mb-6 pl-4">
                            You may <Keyword>not</Keyword> use the Service for any illegal purpose, including spreading spam or hate speech, or attempting to disrupt the Service's servers.
                        </p>

                        <p className="mb-4 text-gray-500">// 4. Termination</p>
                        <p className="mb-6 pl-4">
                            We reserve the right to terminate or suspend your access to the Service at our discretion, without notice, for conduct that violates these Terms.
                        </p>

                        <p className="mb-4 text-gray-500">// 5. Disclaimer of Warranty</p>
                        <p className="mb-6 pl-4">
                            The Service is provided <Highlight>"as is"</Highlight> without any warranties. We do not guarantee that the Service will be available at all times or be free of errors.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}