import ShellHeader from '../../components/ShellHeader';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <ShellHeader />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About SkillCanvas</h1>
        <div className="prose prose-gray max-w-none">
          <p>
            SkillCanvas is an open-source directory for discovering high-quality AI agent skills. 
            Our mission is to provide developers with a curated, editorially vetted collection of 
            tools that actually work — no fluff, no generic AI clichés.
          </p>
          <h2 className="text-xl font-semibold mt-8">Anti-Slop Editorial Standard</h2>
          <p>
            We adhere to a strict editorial standard we call "Anti-Slop": monochrome design, 
            high-density information, and zero generic AI buzzwords. Every skill listed here 
            has been reviewed for real utility and clear documentation.
          </p>
          <h2 className="text-xl font-semibold mt-8">Developer-First Transparency</h2>
          <p>
            Each skill page includes source repository, license, metrics, and supported agents. 
            We believe in full transparency so you can make informed decisions before integrating 
            any skill into your workflow.
          </p>
          <p className="mt-6">
            SkillCanvas is community-driven and open source. Contributions are welcome.
          </p>
        </div>
      </main>
    </div>
  );
}
