import { Lightbulb, Users, Settings, ShieldCheck, Bug, Rocket } from "lucide-react";

const Section = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="text-gray-700 text-sm leading-relaxed">
            {children}
        </div>
    </div>
);

const LandingInfo = () => (
    <div className="max-w-2xl text-gray-800 space-y-8 px-6 py-6 rounded-xl shadow-lg bg-white border border-gray-200">
        <h1 className="text-4xl font-bold text-center mb-2">Welcome to Hayrat Planit</h1>
        <p className="text-center text-gray-600 mb-6 text-base">A clean and community-driven Scrum Poker experience</p>

        <Section icon={Users} title="What is Hayrat?">
            Hayrat is a concept rooted in goodwill, charity, and helpfulness. No personal gain is expected. Our platform embraces this spirit by creating tools that serve the community in the most beneficial way possible.
        </Section>

        <Section icon={Lightbulb} title="What does Hayrat Planit offer?">
            Unlike other Scrum Poker tools, Planit avoids distracting elements and advertisements. Votes are calculated based on selected roles, allowing you to assess the complexity of a task per role. It’s open source and includes a Dockerfile, so you can host and customize it yourself.
            <br />
            GitHub Repository: <a href="https://github.com/iboio/scrum-poker" className="text-blue-600 underline">github.com/iboio/scrum-poker</a>
        </Section>

        <Section icon={Settings} title="How to create a room?">
            Simply enter a room name and choose a card rule. Optionally, you can add tasks in advance to vote on them one by one. Each participant must use a unique username and select a role. Custom roles are supported, but role names are case-insensitive, so it’s recommended to standardize them.
            After voting, click "Show Votes" to see averages per role and overall scores. You can reset the votes or proceed to the next task. Rooms are deleted automatically after 12 hours of inactivity or 24 hours after creation.
        </Section>

        <Section icon={Bug} title="Found a bug or have feedback?">
            Use the feedback button at the bottom right corner, or email us at <a href="mailto:ibrahimkilic37@gmail.com" className="text-blue-600 underline">ibrahimkilic37@gmail.com</a>.
        </Section>

        <Section icon={Rocket} title="What’s next?">
            Hayrat Planit is and will remain free for core use. In the future, we may offer optional premium features—but our priority will always be a simple, ad-free experience.
        </Section>

        <Section icon={ShieldCheck} title="Privacy">
            No user data is stored. All rooms are deleted automatically with no trace left behind.
        </Section>
    </div>
);

export default LandingInfo;