import { Shield, Gamepad2, CheckCircle, AlertTriangle, Users, Clock, Globe, Ban, Camera, AlertOctagon } from 'lucide-react';

const serverRules = [
  { icon: Shield, text: 'Respect Everyone: No hate speech, racism, harassment, or toxic behavior. Banter is fine — abuse is not.' },
  { icon: Ban, text: 'No Spamming or Self-Promo: Keep chats clean. No advertising without permission.' },
  { icon: AlertTriangle, text: 'Keep it PG-13: No NSFW content — let\'s keep this football, not filth.' },
  { icon: Users, text: 'Follow Staff Instructions: Listen to admins & mods. They keep the league running smooth.' },
  { icon: CheckCircle, text: 'One Account per Player: No smurfing, no alt accounts. You\'ll get banned.' },
];

const gameRules = [
  { icon: Gamepad2, title: 'Game Mode', desc: 'Pro Clubs - 11v11 or 5v5 Format' },
  { icon: Clock, title: 'Match Length', desc: '8 minutes per half, Normal speed' },
  { icon: Globe, title: 'Connection', desc: 'Wired connection preferred. Use closest server.' },
  { icon: Ban, title: 'No Exploits', desc: 'Glitch goals, AI exploits, or pause abuse = auto-loss' },
  { icon: Camera, title: 'Proof Required', desc: 'Screenshot results or use match reports to confirm scores' },
  { icon: AlertOctagon, title: 'Card System', desc: 'Red = next match ban | 5 Yellows = 1 match ban' },
];

export default function Rules() {
  return (
    <section className="py-20 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Guidelines</span>
          <h2 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mt-2 mb-4">
            League Rules
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Follow these rules to ensure fair play and a competitive environment for all participants.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Server Rules Card */}
          <div className="bg-surface border border-border rounded-2xl p-8 card-hover">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white">Server Rules</h3>
            </div>
            <ul className="space-y-4">
              {serverRules.map((rule, index) => {
                const Icon = rule.icon;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-text-muted text-sm leading-relaxed">{rule.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Game Rules Card */}
          <div className="bg-surface border border-border rounded-2xl p-8 card-hover">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white">Match Rules</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {gameRules.map((rule, index) => {
                const Icon = rule.icon;
                return (
                  <div key={index} className="p-4 bg-surface-light rounded-xl border border-border/50">
                    <Icon className="w-5 h-5 text-primary mb-2" />
                    <h4 className="text-white font-medium text-sm mb-1">{rule.title}</h4>
                    <p className="text-text-muted text-xs">{rule.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
