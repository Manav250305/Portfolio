import React, { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { Mail, Phone, MapPin, Github, Linkedin, Download, Send, Code, Database, Globe, Smartphone, ArrowRight, ExternalLink, Star, BookOpen, Award, Users, GraduationCap, Briefcase, Calendar } from 'lucide-react';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const projects = [
  {
    title: 'TenderForge - AI-Powered Government Tender Marketplace',
    description: 'Full-Stack SaaS Platform that aggregates government tenders and generates AI-powered proposals, reducing bid preparation time by 90%.',
    tech: ['React.js', 'Node.js', 'OpenAI API', 'Firebase', 'Stripe'],
    github: 'https://github.com/Manav250305/Tender-Forge',
    image: '/TenderForge.png'
  },
  {
    title: 'SmartClaims AI',
    description: 'LLM-powered insurance document analyzer with clause-based reasoning.',
    tech: ['LangChain', 'Node.js', 'MongoDB', 'OpenAI'],
    github: 'https://github.com/Manav250305/SmartClaims-AI',
    image: '/SmartClaims.png'
  },
  {
  title: 'Voice-Powered Shopping Assistant',
  description: 'Conversational shopping UI that allows users to search and add products to cart using voice commands.',
  tech: ['React', 'SpeechRecognition API', 'Node.js'],
  github: 'https://github.com/Manav250305/shopping-ai',
  image: 'Shopping-AI.png'
  }
];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Updated to use the correct deployed backend URL
      const response = await fetch('https://portfolio-backend-api-zeta.vercel.app/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'resume', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll projects carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, 4000); // Change project every 4 seconds

    return () => clearInterval(interval);
  }, [projects.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

const skills = [
  { name: 'JavaScript (ES6+)', level: 85, icon: Code },
  { name: 'React.js', level: 90, icon: Globe },
  { name: 'Node.js', level: 80, icon: Database },
  { name: 'Python', level: 90, icon: Code },
  { name: 'Java', level: 75, icon: Code },
  { name: 'C', level: 90, icon: Code },
  { name: 'C++', level: 90, icon: Code },
  { name: 'MongoDB', level: 70, icon: Database },
  { name: 'Firebase', level: 75, icon: Database },
  { name: 'SQL', level: 65, icon: Database },
  { name: 'HTML5 & CSS3', level: 95, icon: Globe },
  { name: 'Tailwind CSS', level: 70, icon: Globe },
  { name: 'Git & GitHub', level: 90, icon: Code },
  { name: 'OpenAI API', level: 85, icon: Code },
  { name: 'LangChain', level: 75, icon: Code },
  { name: 'Machine Learning', level: 80, icon: Code },
  { name: 'Stripe Integration', level: 70, icon: Code },
  { name: 'JWT Authentication', level: 75, icon: Code }
];
  const resumeData = {
    education: [
      {
        institution: "Vellore Institute of Technology (VIT)",
        degree: "Bachelor of Technology in Computer Science and Engineering",
        location: "Vellore, Tamil Nadu",
        duration: "2023 - 2027",
        cgpa: "9.67/10",
        relevant: ["Data Structures & Algorithms", "Machine Learning", "Web Development", "Database Management"]
      }
    ],
    experience: [
      {
        company: "Civilytix",
        position: "AI/ML Intern",
        duration: "Aug 2025 - Present",
        location: "Tamil Nadu, India (Remote)",
        responsibilities: [
          "Building lightweight AI models for in-car applications to detect road quality issues",
          "Optimizing models for real-time deployment on low-spec automotive hardware",
          "Contributing to scalable data pipelines that share road quality metrics with centralized systems",
          "Developing smarter mobility insights through advanced machine learning techniques"
        ]
      },
      {
        company: "Personal Projects",
        position: "Full Stack Developer",
        duration: "2023 - Present",
        location: "VIT Vellore",
        responsibilities: [
          "Developed multiple full-stack applications using React, Node.js, and MongoDB",
          "Implemented AI-powered features using LangChain and OpenAI API",
          "Built responsive and user-friendly interfaces with modern design principles",
          "Worked with various APIs and integrated third-party services"
        ]
      }
    ],
    projects: [
      {
        name: "TenderForge - AI-Powered Government Tender Marketplace",
        tech: "React.js, Node.js, OpenAI API, Firebase, Stripe",
        description: "Full-Stack SaaS Platform that aggregates government tenders from USA, UK, Canada & Australia and generates AI-powered proposals, reducing bid preparation time by 90%.",
        highlights: ["Real-time tender discovery across 4 government APIs", "AI proposal generation with PDF download", "Secure JWT authentication & Stripe payment integration", "Vector embeddings for intelligent tender matching"]
      },
      {
        name: "SmartClaims AI",
        tech: "LangChain, Node.js, MongoDB, OpenAI API",
        description: "LLM-powered insurance document analyzer with clause-based reasoning and automated claim processing.",
        highlights: ["Automated document analysis", "Clause-based reasoning", "95% accuracy in claim validation"]
      },
      {
        name: "Voice-Powered Shopping Assistant",
        tech: "React, SpeechRecognition API, Node.js",
        description: "Conversational shopping interface allowing voice commands for product search and cart management.",
        highlights: ["Voice command integration", "Real-time speech processing", "Intuitive user experience"]
      }
    ],
    skills: {
      programming: ["C", "C++", "Java", "Python", "JavaScript (ES6+)"],
      webDev: ["React.js", "Node.js", "HTML5", "CSS3", "Tailwind CSS", "Express.js"],
      databases: ["MongoDB", "Firebase Firestore", "SQL"],
      tools: ["Git", "GitHub", "VS Code", "Vercel", "Stripe", "JWT"],
      aiml: ["OpenAI API", "Machine Learning", "Natural Language Processing", "LangChain", "Vector Embeddings", "Real-time AI Models"]
    },
    achievements: [
      "Currently working as AI/ML Intern at Civilytix, building real-time AI models for automotive applications",
      "Developed 4+ full-stack applications including a SaaS platform that reduces bid preparation time by 90%",
      "Built production-ready applications with 100+ users and integrated multiple APIs",
      "Strong foundation in AI/ML with hands-on experience in model optimization for low-spec hardware",
      "Active GitHub contributor with multiple repositories and open-source projects"
    ],
    certifications: [
      {
        title: "Oracle Cloud Infrastructure (OCI)",
        items: [
          "Generative AI Professional – 2025",
          "AI Foundations Associate"
        ]
      },
      {
        title: "DeepLearning.AI & Stanford CPD",
        items: [
          "Advanced Learning Algorithms",
          "Supervised Machine Learning: Regression & Classification",
          "Machine Learning"
        ]
      },
      {
        title: "Google Cloud",
        items: ["Introduction to Generative AI Learning Path"]
      },
      {
        title: "IBM",
        items: [
          "AI for Everyone", 
          "Introduction to HTML, CSS, & JavaScript",
          "Introduction to Software Engineering,Getting Started with Git and GitHub"
        ]
      }
    ],
    notable: [
      "100% Attendance at VIT – Demonstrates strong commitment, discipline, and consistency throughout my academic journey."
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Manav
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {['Home', 'About', 'Skills', 'Resume', 'Projects', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === item.toLowerCase()
                        ? 'bg-gray-800 text-blue-400'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`bg-current w-6 h-0.5 rounded-sm transition-all ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`} />
                  <span className={`bg-current w-6 h-0.5 rounded-sm mt-1 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`bg-current w-6 h-0.5 rounded-sm mt-1 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
              {['Home', 'About', 'Skills', 'Resume', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                    activeSection === item.toLowerCase()
                      ? 'bg-gray-700 text-blue-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Manav
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-300 mb-4">
              I am a{' '}
              <span className="text-blue-400 font-semibold">
                <Typewriter
                  words={['Developer', 'AI Enthusiast', 'Problem Solver', 'Tech Explorer']}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
            </p>
            <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              AI/ML Intern at Civilytix | CSE Student at VIT Vellore
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Building lightweight AI models for real-time applications and developing full-stack SaaS platforms. 
              Passionate about machine learning, web development, and creating innovative solutions that make a real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('projects')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                View My Work <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="border border-gray-500 hover:border-blue-400 px-8 py-3 rounded-lg font-semibold transition-all hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                Get In Touch <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-400">A Bit About Me</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Hi there! I'm Manav, currently working as an AI/ML Intern at Civilytix where I build lightweight 
                AI models for in-car applications and optimize them for real-time deployment on automotive hardware. 
                I'm also pursuing my Bachelor's degree in Computer Science and Engineering at VIT, Vellore.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                I specialize in full-stack development and machine learning, having built production-ready applications 
                including TenderForge - a SaaS platform that reduces government tender bid preparation time by 90%. 
                I'm passionate about creating innovative solutions that solve real-world problems and always eager to 
                collaborate on projects that make a meaningful impact.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <span>CSE Student</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  <span>VIT Vellore</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-400" />
                  <span>Team Player</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-400" />
                  <span>Problem Solver</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold">
                    <img src="./Me.jpg" alt="Manav" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Always Learning</h4>
                  <p className="text-gray-400">
                    Constantly exploring new technologies and expanding my skill set
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Skills & Technologies</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div key={skill.name} className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <Icon className="w-8 h-8 text-blue-400" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
       {/* Resume Section */}
      <section id="resume" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Resume</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto" />
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              A comprehensive overview of my education, experience, and achievements
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Education */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                  Education
                </h3>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                    <h4 className="text-xl font-semibold text-blue-400 mb-2">{edu.institution}</h4>
                    <p className="text-lg font-medium mb-2">{edu.degree}</p>
                    <div className="flex items-center gap-4 text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {edu.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {edu.location}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">CGPA: {edu.cgpa}</p>
                    <div>
                      <p className="font-medium mb-2">Relevant Coursework:</p>
                      <div className="flex flex-wrap gap-2">
                        {edu.relevant.map((course) => (
                          <span key={course} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                  Experience
                </h3>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                    <h4 className="text-xl font-semibold text-blue-400 mb-2">{exp.position}</h4>
                    <p className="text-lg font-medium mb-2">{exp.company}</p>
                    <div className="flex items-center gap-4 text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start gap-2">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Notable Achievements */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6 text-blue-400" />
                  Notable Achievement
                </h3>
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                  <ul className="space-y-3">
                    {resumeData.notable.map((note, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-3">
                        <Star className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              

              {/* Technical Skills */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Code className="w-6 h-6 text-blue-400" />
                  Technical Skills
                </h3>
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 space-y-4">
                  <div>
                    <h5 className="font-semibold text-blue-400 mb-2">Programming Languages</h5>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.programming.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-400 mb-2">Web Development</h5>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.webDev.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-400 mb-2">Databases & Tools</h5>
                    <div className="flex flex-wrap gap-2">
                      {[...resumeData.skills.databases, ...resumeData.skills.tools].map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-400 mb-2">AI/ML & Emerging Tech</h5>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.aiml.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-400" />
                  Achievements
                </h3>
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                  <ul className="space-y-3">
                    {resumeData.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-3">
                        <Star className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  Certifications
                </h3>
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 space-y-4">
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-blue-400 mb-2">{cert.title}</h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {cert.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Download Resume Button */}
          <div className="text-center mt-12">
            <a
              href="https://drive.google.com/file/d/11al7h_JezqgtqCw3cpvhT6RdRX4JZzys/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto w-fit px-6 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              View Resume <Download className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Projects</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto" />
            <p className="text-gray-400 mt-6">Automatically scrolling through my latest work</p>
          </div>
          
          {/* Auto-scrolling carousel */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentProjectIndex * 100}%)` }}
            >
              {projects.map((project, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-4xl mx-auto bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 group">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Project Image */}
                      <div className="aspect-video md:aspect-square bg-gray-800 overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Project Details */}
                      <div className="p-8 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 mb-6 text-lg leading-relaxed">{project.description}</p>
                        
                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech.map((tech) => (
                            <span key={tech} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                        
                        {/* Links */}
                        <div className="flex gap-4">
                          <a 
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                          >
                            <Github className="w-4 h-4" />
                            View Code
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProjectIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentProjectIndex 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ArrowRight className="w-6 h-6 rotate-180" />
            </button>
            
            <button
              onClick={() => setCurrentProjectIndex((prev) => (prev + 1) % projects.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get In Touch</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto" />
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities, collaborations, or just having a chat about technology!
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-8">Let's Connect</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-400">manavprakash91@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-400">+91 95605 43184</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-400">VIT Vellore, Tamil Nadu</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="font-semibold mb-4">Follow Me</p>
                <div className="flex gap-4">
                  <a href="https://github.com/Manav250305" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/manavprakash25/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell me about your project, idea, or just say hello!"
                  />
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                {submitStatus === 'success' && (
                  <div className="text-green-400 text-center">
                    Message sent successfully! I'll get back to you soon.
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="text-red-400 text-center">
                    Something went wrong. Please try again later.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 Manav.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;