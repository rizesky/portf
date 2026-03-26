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
                content: `Software Engineer | Mar 2023 - Mar 2025
• Designed and developed backend services for large-scale multiplayer gaming platforms, supporting real-time, high
  concurrency workloads.
• Designed and improved platform services for server upload and configuration promotion, enabling clients to manage game
  server environments reliably and reducing deployment errors by 25%.
• Resolved critical production issues, such as deployment overshoot and core dump failures, improving system stability and
  observability. Resulting in much better client satisfaction.
• Designed and implemented event-driven systems using Kafka and also other cheaper pubsub/queue tool to support scalable,
  asynchronous communication across distributed services, improving system resilience and decoupling.
• Developed data intelligence services to support game analytics and player data processing, integrating with AWS Data
  Kinesis, and Fivetran and other vendor as per client requests.
• Operated distributed game multiplayer platform systems across multi-cloud environments including Amazon Web Services,
  Google Cloud, and Microsoft Azure using Kubernetes and Nomad.

Software Engineer Backend | Oct 2022 - Mar 2023
•Designed and optimized backend services for a user-facing loan system, improving processing performance by 15% and
 enabling more successful loan applications.
•Developed and updated internal auditing services to improve financial transparency and strengthen risk control. 
•Maintained backend systems for credit and loan services, ensuring reliability in financial operations.

Software Engineer Backend | Oct 2021 - Oct 2022
• Developed and maintained collection and recovery backend systems
• Included contract management, unit management, bidding, tracking, and remarketing services
• Refactored application architecture, eliminating redundant code layers, improving stability and overall performance
• Designed and implemented three interrelated backend services for unit tracking and recovery

Software Engineer Backend | Apr 2019 - Oct 2021
• Developed and maintained microservices for client management, premium processing, agent services, and internal tooling
• Optimized data structures and process flows for traditional and unit-link products
• Improved system performance and reliability

Backend Developer | Sept 2018 - Apr 2019
• Developed backend services for programmatic advertising and big data processing (Hadoop, Hive)
• Modernized legacy applications using modern technologies
• Improved performance, maintainability, and scalability`
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
                content: `Institut Teknologi Del | 2015-2018
Bachelor of Information Technology

SMA Unggul Del | 2012-2015
Science`
              },
              'summary.txt': {
                type: 'file',
                content: `I am a Software Engineer with ${new Date().getFullYear() - 2018} years of experience in Software Engineering.
I like to build robust backend systems that work seamlessly and meet business needs.

Hands-on in Java, Go, TypeScript, and Python. Crafted scalable
enterprise apps, fintech platforms, data-intensive systems, and
game backends infrastructure.`
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
                    content: `# Game Backend Infrastructure (PAAS)

Built scalable game server management systems for modern gaming platforms.

## Features
- Server uploader and config promoter
- Analytics pipelines for in-game data
- Player engagement insights
- Matchmaking optimization
- Monetization analytics

## Technologies
- Go
- Kubernetes
- Nomad
- gRPC

## Achievements
- 25% improvement in uptime
- Reduced deployment errors significantly
- Enhanced system reliability`
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

Developed credit scoring and loan disbursement APIs for financial services.

## Features
- Credit scoring algorithms
- Loan disbursement APIs
- Risk assessment
- Payment processing
- Audit trails

## Technologies
- Java
- Spring Boot
- PostgreSQL
- Redis

## Achievements
- 15% performance improvement
- Enhanced maintainability
- Improved deployment efficiency`
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

Designed and implemented client/agent service APIs for insurance platform.

## Features
- Client management services
- Premium processing
- Agent services
- Internal tooling
- Unit-link products

## Technologies
- Java
- Spring Boot
- Oracle DB
- Microservices architecture

## Achievements
- Eliminated redundant code layers
- Improved system stability
- Enhanced performance`
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
    ██████╔╝██║  ██╔╝ █████╗  ███████╗█████╔╝  ╚████╔╝ 
    ██╔══██╗██║ ██╔╝  ██╔══╝  ╚════██║██╔═██╗   ╚██╔╝  
    ██║  ██║██║███████╗███████╗███████║██║  ██╗   ██║   
    ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   

═══════════════════════════════════════
🎯 Backend Engineer | Software Engineer
🚀 ${new Date().getFullYear() - 2018} years of experience
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
