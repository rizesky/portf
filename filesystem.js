class PortoOSFileSystem {
  constructor() {
    this.currentPath = '/home/visitor';
    this.illegalActions = 0;
    this.maxIllegalActions = 3;
    this.fs = {
      '/home/visitor': {
        type: 'directory',
        children: {
          'about': {
            type: 'directory',
            children: {
              'experience.txt': {
                type: 'file',
                content: `Software Engineer — Game Backend Platform | Mar 2023 — Mar 2025

Built and operated the platform that game studios used to ship
and run their multiplayer servers across regions. Lots of moving
parts, lots of opinions about what "good" looks like.

What I actually did:
• Worked on the server-upload and config-promotion pipeline,
  helping move it toward a self-serve flow with versioned
  rollouts so studios weren't blocked on us for every deploy.
• Helped chase down deployment overshoot and core dump issues
  that were hurting reliability — reproduced, fixed, and added
  the observability we'd been missing.
• Built event pipelines that fan gameplay events out to analytics.
  Kafka where it earned its keep, cheaper pub/sub where it didn't.
• Wired data intelligence services to AWS Kinesis, Fivetran, and
  a few other vendors clients insisted on. Mostly the boring
  part: schemas, contracts, idempotency, retries.
• Ran workloads across AWS, GCP, and Azure (the joys of
  multi-cloud-by-customer-request). Kubernetes for the new fleet,
  Nomad for the bits we hadn't migrated yet.

Stack: Go (mostly), Java, gRPC, Kafka, Kinesis, K8s, Nomad,
Terraform, the usual observability suspects.

──────────────────────────────────────────────────────────────

Software Engineer Backend — Fintech / Lending | Oct 2022 — Mar 2023

Short stint, sharp focus: keep the loan system fast and the
auditors happy.

• Profiled and reshaped the hot path on a user-facing loan
  application service. Cut latency enough to push approval
  throughput up ~15% — turns out the slow part was a query
  nobody had looked at since the original migration.
• Rewrote chunks of the internal auditing service so finance
  could actually trust the numbers and risk could see what
  changed and when.
• Kept credit and loan backends boringly reliable. Boring is
  the highest compliment you can pay a money-moving system.

Stack: Java, Spring Boot, PostgreSQL, Redis.

──────────────────────────────────────────────────────────────

Software Engineer Backend — Collections & Recovery | Oct 2021 — Oct 2022

The unsexy half of lending: what happens after someone stops
paying. Contract management, bidding, tracking, remarketing —
a tangled domain with real consequences for real people.

• Inherited an architecture that had grown four layers thick
  for no good reason. Stripped two of them out without breaking
  prod. Performance and on-call sanity both improved.
• Designed and shipped three backend services that talked to
  each other for unit tracking and recovery. Drew a lot of
  sequence diagrams. Revised them more times than I'd like.
• Spent a lot of time arguing for clearer domain models. Worth
  every meeting.

Stack: Java, Spring Boot, PostgreSQL.

──────────────────────────────────────────────────────────────

Software Engineer Backend — Insurance | Apr 2019 — Oct 2021

Big legacy insurance stack. Deep, careful work — the kind
where moving fast and breaking things is genuinely how you get
sued.

• Maintained and extended microservices for client management,
  premium processing, agent services, and the internal tools
  that kept the operations team sane.
• Got intimate with traditional vs unit-link product math —
  the data structures alone are an education in actuarial
  pragmatism.
• Quietly improved performance and reliability across the
  fleet. Nothing flashy, just fewer pages.

Stack: Java, Spring Boot, Oracle DB, microservices.

──────────────────────────────────────────────────────────────

Backend Developer — AdTech & Big Data | Sept 2018 — Apr 2019

First role out the gate. Programmatic advertising at scale,
which is a fancy way of saying "every request matters and
nothing is allowed to be slow."

• Wrote backend services that fed Hadoop / Hive pipelines for
  ad analytics. Learned what "data-intensive" really means
  the hard way.
• Helped drag legacy apps into the modern era. Turns out
  modernization is 10% new tech and 90% reading old code very
  carefully.
• Picked up a healthy respect for systems that have been
  running longer than you've been a developer.

Stack: Java, Hadoop, Hive.`
              },
              'skills.txt': {
                type: 'file',
                content: `Skills Tree:
├── Languages
│   ├── Java (Expert)
│   │   ├── Spring Boot
│   │   ├── Quarkus
│   │   ├── Spring Security
│   │   └── JUnit
│   ├── Go (Advanced)
│   │   ├── Gin
│   │   ├── Gorestful
│   │   ├── Echo
│   │   └── Chi
│   ├── TypeScript (Advanced)
│   │   ├── NestJS
│   │   ├── Express.js
│   │   └── Fastify
│   ├── Python (Intermediate)
│   │   ├── FastAPI
│   │   ├── Django
│   │   ├── Flask
│   │   └── Data processing
│   └── SQL (Advanced)
│       ├── PostgreSQL
│       ├── MySQL
│       ├── Oracle
│       └── SQL Server
├── Backend Technologies
│   ├── Message Queues
│   │   ├── Apache Kafka
│   │   ├── RabbitMQ
│   │   ├── Redis Pub/Sub
│   │   └── Amazon SQS
│   ├── Databases
│   │   ├── PostgreSQL
│   │   ├── MySQL
│   │   ├── Oracle
│   │   ├── MongoDB
│   │   ├── Redis
│   │   └── Cassandra
│   ├── Caching
│   │   ├── Redis
│   │   ├── Memcached
│   │   ├── Hazelcast
│   │   └── Caffeine
│   ├── Search Engines
│   │   ├── Elasticsearch
│   │   ├── Apache Solr
│   │   └── OpenSearch
│   ├── API Gateway
│   │   ├── Kong
│   │   ├── Zuul
│   │   ├── AWS API Gateway
│   │   └── Google Cloud Endpoints
│   └── Microservices
│       ├── Service Mesh (Istio)
│       ├── Circuit Breakers
│       ├── Load Balancing
│       └── Service Discovery
├── Cloud Platforms
│   ├── AWS
│   │   ├── EC2, ECS, EKS
│   │   ├── RDS
│   │   ├── S3, CloudFront
│   │   ├── Lambda, API Gateway
│   │   ├── SQS, SNS, EventBridge
│   │   ├── CloudWatch
│   │   └── IAM, VPC
│   ├── Google Cloud Platform
│   │   ├── Compute Engine, GKE
│   │   ├── Cloud SQL, Firestore
│   │   ├── Cloud Storage, CDN
│   │   ├── Cloud Functions, Cloud Run
│   │   ├── Pub/Sub, Cloud Tasks
│   │   ├── Monitoring, Logging
│   │   └── IAM, VPC, Security
│   └── Microsoft Azure
│       ├── Virtual Machines, AKS
│       ├── SQL Database, Cosmos DB
│       ├── Blob Storage, CDN
│       ├── Functions, App Service
│       ├── Service Bus, Event Grid
│       ├── Monitor, Application Insights
│       └── Active Directory, VNet
├── DevOps & Infrastructure
│   ├── Containerization
│   │   ├── Docker
│   │   ├── Docker Compose
│   │   └── Container Registry
│   ├── Orchestration
│   │   ├── Kubernetes
│   │   ├── Docker Swarm
│   │   └── Nomad
│   ├── Infrastructure as Code
│   │   ├── Terraform
│   │   ├── CloudFormation
│   │   └── Ansible
│   ├── CI/CD
│   │   ├── Jenkins
│   │   ├── GitLab CI
│   │   ├── GitHub Actions
│   │   ├── Azure DevOps
│   │   └── CircleCI
│   ├── Monitoring & Observability
│   │   ├── Prometheus
│   │   ├── Grafana
│   │   ├── ELK Stack
│   │   ├── Jaeger
│   │   ├── New Relic
│   │   └── DataDog
│   └── Security
│       ├── OAuth 2.0 / OIDC
│       ├── JWT
│       ├── SSL/TLS
│       ├── Vault
│       └── Security Scanning
└── Soft Skills
    ├── Problem Solver
    ├── Fast Learner
    ├── Team collaboration
    ├── System design
    ├── Architecture planning
    └── Technical mentoring`
              },
              'education.txt': {
                type: 'file',
                content: `Institut Teknologi Del | 2015 — 2018
Information Technology (3 years, did not finish)

Three years in. Late nights, terrible coffee, and the kind of
professors who make you actually understand pointers before
they let you pass. I left before graduating to start working
full-time as an engineer — most of what I know about the craft
I learned on the job, but the foundations came from here.

SMA Unggul Del | 2012 — 2015
Science track

This is where I first wrote something that printed
"Hello, World" and felt like a wizard.`
              },
              'summary.txt': {
                type: 'file',
                content: `Hi, I'm Rizesky. I build backends that don't fall over.

~7 years writing services in Java, Go, TypeScript, and Python.
Mostly the unglamorous middle of the stack: queues, schemas,
retries, the 3am pages. I've shipped fintech that moves real
money, insurance platforms with decades of legacy to respect,
ad-tech that crunches Hadoop jobs nobody wants to touch, and
game backends that fan out to multi-region multiplayer fleets.

I like: distributed systems, boring technology, code that's
obviously correct, postmortems that don't blame people, and
shipping things end-to-end instead of throwing JIRA tickets
over a wall.

I dislike: microservices for the sake of it, untyped JSON
floating between services, and "we'll add tests later".

Type 'cat about/experience.txt' for the long version,
or 'cat contact/email.txt' if you want to talk.`
              }
            }
          },
          'projects': {
            type: 'directory',
            children: {
              'game-backend': {
                type: 'directory',
                children: {
                  'README.md': {
                    type: 'file',
                    content: `# Game Backend Platform (PaaS)

The control plane game studios used to ship and operate their
multiplayer servers. Think Heroku, but for game servers, with
the added joy of multi-cloud and "the build pipeline can't be
slower than the studio's patience."

## What it actually does
- Server uploader + config promoter (versioned, rollback-able)
- Event pipelines fanning gameplay data into analytics
- Matchmaking knobs the platform team could tune without
  rebuilding services
- Monetization analytics that didn't lie to the finance team

## Stack
- Go for everything new
- Kubernetes (new fleet) + Nomad (legacy fleet)
- gRPC between services, Kafka where it earned it
- Terraform, the usual observability stack

## What I'm proud of
- Bad-deploy rate dropped ~25% after the self-serve flow shipped
- Found and killed a long-standing pod-overshoot bug nobody had
  isolated; it lived in the reconciliation loop
- Resisted the "Kafka for everything" reflex and saved real money`
                  },
                  'tech-stack.txt': {
                    type: 'file',
                    content: `Go, Kubernetes, Nomad, gRPC, Docker, Redis`
                  }
                }
              },
              'fintech': {
                type: 'directory',
                children: {
                  'README.md': {
                    type: 'file',
                    content: `# Fintech Loan Platform

The backends behind a user-facing loan product: scoring,
disbursement, and the auditing layer the finance and risk
teams actually trusted.

## What it actually does
- Credit scoring on the hot path (had to be fast or applications
  timed out)
- Loan disbursement APIs that talked to a dozen downstream
  systems and had to stay idempotent
- Audit trails that finance could query without paging an engineer
- Payment processing that couldn't lose a single message

## Stack
- Java + Spring Boot
- PostgreSQL (the source of truth)
- Redis (the speed layer)

## What I'm proud of
- ~15% throughput bump on the application flow after profiling
  uncovered a query nobody had touched since the original migration
- Rewrote the auditing service so finance stopped DM'ing engineers
  for ad-hoc reports
- Zero money-losing incidents on my watch — the highest compliment
  you can pay a system that moves money`
                  },
                  'tech-stack.txt': {
                    type: 'file',
                    content: `Java, Spring Boot, PostgreSQL, Redis, Docker`
                  }
                }
              },
              'insurance': {
                type: 'directory',
                children: {
                  'README.md': {
                    type: 'file',
                    content: `# Insurance Microservices

A big legacy insurance stack that needed careful, deliberate
work. This is the kind of domain where moving fast and breaking
things is genuinely how you get sued.

## What it actually does
- Client management — onboarding, KYC, the messy real-world bits
- Premium processing — schedules, grace periods, the math you
  do not want to get wrong
- Agent services — the tools field agents lived in all day
- Internal tooling that kept ops from drowning
- Unit-link product flows (the data structures alone are an
  education in actuarial pragmatism)

## Stack
- Java + Spring Boot
- Oracle DB (yes, Oracle, and yes I learned to love it)
- Microservices, sized to the domain — not because microservices

## What I'm proud of
- Quietly removed two redundant layers from the architecture
  without a single rollback
- Got the on-call rotation a lot quieter than I found it
- Built up a deep respect for systems that have been running
  longer than I've been a developer`
                  },
                  'tech-stack.txt': {
                    type: 'file',
                    content: `Java, Spring Boot, Oracle DB, Microservices, Docker`
                  }
                }
              }
            }
          },
                'contact': {
                  type: 'directory',
                  children: {
                    'email.txt': {
                      type: 'file',
                      content: `rizesky.slgn@gmail.com`
                    },
                    'phone.txt': {
                      type: 'file',
                      content: `+62 822-9474-9017`
                    },
                    'social.txt': {
                      type: 'file',
                      content: `LinkedIn: linkedin.com/in/rizesky
GitHub: github.com/rizesky`
                    }
                  }
                },
                'profile.txt': {
                  type: 'file',
                  content: `👨‍💻 RIZESKY - SOFTWARE ENGINEER
═══════════════════════════════════════

    ██████╗ ██╗███████╗███████╗███████╗██╗  ██╗██╗   ██╗
    ██╔══██╗██║╚══███╔╝██╔════╝██╔════╝██║ ██╔╝╚██╗ ██╔╝
    ██████╔╝██║  ██╔╝  █████╗  ███████╗█████╔╝  ╚████╔╝ 
    ██╔══██╗██║ ██╔╝   ██╔══╝  ╚════██║██╔═██╗   ╚██╔╝  
    ██║  ██║██║███████╗███████╗███████║██║  ██╗   ██║   
    ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   

═══════════════════════════════════════
🎯 Backend Engineer | Software Engineer
🚀 7 years of experience
💻 Java, Go, TypeScript, Python
☁️  AWS, GCP, Azure
🔧 Microservices, DevOps, Kubernetes

═══════════════════════════════════════
"Building robust systems that scale" 🛠️
═══════════════════════════════════════`
                },
          '.bashrc': {
            type: 'file',
            content: `# PortoOS .bashrc
export PS1="visitor@portoos:\\w\\$ "
export EDITOR=nano
export BROWSER=firefox
alias ll='ls -la'
alias ..='cd ..'
alias about='cat about/summary.txt'
alias skills='cat about/skills.txt'
alias projects='ls projects/'
alias contact='cat contact/email.txt'`
          },
          '.profile': {
            type: 'file',
            content: `# PortoOS .profile
echo "Welcome to PortoOS v1.0.0 - Portfolio Edition"
echo "Type 'help' for available commands"`
          },
        }
      }
    };
  }

  ls(path = null) {
    const targetPath = path ? this.resolvePath(path) : this.currentPath;
    const node = this.getNode(targetPath);
    
    if (!node) {
      return { error: `ls: cannot access '${path}': No such file or directory` };
    }
    
    if (node.type !== 'directory') {
      return { error: `ls: '${path}': Not a directory` };
    }
    
    const files = Object.keys(node.children || {});
    return { files };
  }

  cd(path) {
    if (!path) {
      this.currentPath = '/home/visitor';
      return { path: this.currentPath };
    }
    
    const targetPath = this.resolvePath(path);
    
    // Check for illegal actions
    if (this.isIllegalPath(targetPath)) {
      this.illegalActions++;
      if (this.illegalActions >= this.maxIllegalActions) {
        return { action: 'nuke', reason: 'Attempting to access restricted areas' };
      }
      return { error: `cd: ${path}: Access denied. Warning: ${this.maxIllegalActions - this.illegalActions} attempts remaining before system lockdown.` };
    }
    
    const node = this.getNode(targetPath);
    
    if (!node) {
      return { error: `cd: ${path}: No such file or directory` };
    }
    
    if (node.type !== 'directory') {
      return { error: `cd: ${path}: Not a directory` };
    }
    
    this.currentPath = targetPath;
    return { path: this.currentPath };
  }

  isIllegalPath(path) {
    // Illegal to go outside /home/visitor
    return !path.startsWith('/home/visitor') && path !== '/home/visitor';
  }

  cat(filePath) {
    const targetPath = this.resolvePath(filePath);
    const node = this.getNode(targetPath);
    
    if (!node) {
      return { error: `cat: ${filePath}: No such file or directory` };
    }
    
    if (node.type !== 'file') {
      return { error: `cat: ${filePath}: Is a directory` };
    }
    
    return { content: node.content };
  }

  pwd() {
    return this.currentPath;
  }

  resolvePath(path) {
    if (path.startsWith('/')) {
      return path;
    }
    
    if (path === '..') {
      const parts = this.currentPath.split('/').filter(p => p);
      if (parts.length <= 2) { // /home/visitor
        return '/home/visitor';
      }
      parts.pop();
      return '/' + parts.join('/');
    }
    
    if (path === '.') {
      return this.currentPath;
    }
    
    return this.currentPath + '/' + path;
  }

  getNode(path) {
    // Handle absolute paths starting with /home/visitor
    if (path.startsWith('/home/visitor')) {
      const relativePath = path.substring('/home/visitor'.length);
      const parts = relativePath.split('/').filter(p => p);
      let current = this.fs['/home/visitor'];
      
      for (const part of parts) {
        if (!current.children || !current.children[part]) {
          return null;
        }
        current = current.children[part];
      }
      
      return current;
    }
    
    // Handle relative paths
    const parts = path.split('/').filter(p => p);
    let current = this.fs['/home/visitor'];
    
    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null;
      }
      current = current.children[part];
    }
    
    return current;
  }

  tree(path = null) {
    const targetPath = path ? this.resolvePath(path) : this.currentPath;
    const node = this.getNode(targetPath);
    
    if (!node) {
      return { error: `tree: cannot access '${path}': No such file or directory` };
    }
    
    if (node.type !== 'directory') {
      return { error: `tree: '${path}' is not a directory` };
    }
    
    const treeOutput = this.buildTree(node, '', true);
    return { tree: treeOutput };
  }

  buildTree(node, prefix, isLast) {
    let output = '';
    
    if (node.type === 'directory') {
      const children = Object.keys(node.children || {});
      children.forEach((name, index) => {
        const child = node.children[name];
        const isLastChild = index === children.length - 1;
        const currentPrefix = isLast ? '└── ' : '├── ';
        const nextPrefix = isLast ? '    ' : '│   ';
        
        output += prefix + currentPrefix + name + '\n';
        
        if (child.type === 'directory') {
          output += this.buildTree(child, prefix + nextPrefix, isLastChild);
        }
      });
    }
    
    return output;
  }
}
