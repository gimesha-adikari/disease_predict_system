export default function Footer() {
    return (
        <footer className="py-10 opacity-70">
            <div className="container text-sm">
                <div className="border-t border-white/10 pt-6 flex flex-wrap items-center gap-2">
                    <span>© {new Date().getFullYear()} Hospital Console</span>
                    <span className="mx-1">•</span>
                    <span>Secure patient onboarding & monitoring</span>
                </div>
            </div>
        </footer>
    );
}
