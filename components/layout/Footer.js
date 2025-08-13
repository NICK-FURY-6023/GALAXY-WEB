import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="w-full py-6 px-8 mt-auto glass-card">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} GALAXY Bot. Developed by NICK FURY.</p>
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/privacy-policy" className="hover:text-primary dark:hover:text-primary-dark transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms-and-conditions" className="hover:text-primary dark:hover:text-primary-dark transition-colors">
                        Terms & Conditions
                    </Link>
                </div>
            </div>
        </footer>
    );
}