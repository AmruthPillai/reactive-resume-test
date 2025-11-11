import z from "zod";
import type { IconName } from "@/components/input/icon-picker";

export const iconSchema = z.custom<IconName>().or(z.literal(""));

export const urlSchema = z.object({
	url: z.url().or(z.literal("")),
	label: z.string(),
});

export const pictureSchema = z.object({
	url: z.url().or(z.literal("")),
	size: z.number(),
	aspectRatio: z.number(),
	borderRadius: z.number(),
	hidden: z.boolean(),
	shadow: z.boolean(),
	grayscale: z.boolean(),
	border: z.object({
		width: z.number(),
		color: z.string(),
		style: z.enum(["solid", "dashed", "dotted"]),
	}),
});

export const customFieldSchema = z.object({
	id: z.string(),
	icon: iconSchema,
	text: z.string(),
});

export const basicsSchema = z.object({
	name: z.string(),
	headline: z.string(),
	email: z.email().or(z.literal("")),
	phone: z.string(),
	location: z.string(),
	website: urlSchema,
	customFields: z.array(customFieldSchema),
});

export const summarySchema = z.object({
	title: z.string(),
	columns: z.number(),
	hidden: z.boolean(),
	content: z.string(),
});

export const baseItemSchema = z.object({
	id: z.string(),
	hidden: z.boolean(),
});

export const awardItemSchema = baseItemSchema.extend({
	title: z.string().min(1),
	awarder: z.string(),
	date: z.string(),
	website: urlSchema,
	description: z.string(),
});

export const certificationItemSchema = baseItemSchema.extend({
	title: z.string().min(1),
	issuer: z.string(),
	date: z.string(),
	website: urlSchema,
	description: z.string(),
});

export const educationItemSchema = baseItemSchema.extend({
	school: z.string().min(1),
	degree: z.string(),
	area: z.string(),
	grade: z.string(),
	location: z.string(),
	period: z.string(),
	website: urlSchema,
	description: z.string(),
});

export const experienceItemSchema = baseItemSchema.extend({
	company: z.string().min(1),
	position: z.string(),
	location: z.string(),
	period: z.string(),
	website: urlSchema,
	description: z.string(),
});

export const interestItemSchema = baseItemSchema.extend({
	icon: iconSchema,
	name: z.string().min(1),
	keywords: z.array(z.string()).catch([]),
});

export const languageItemSchema = baseItemSchema.extend({
	language: z.string().min(1),
	fluency: z.string(),
	level: z.number().min(0).max(5).catch(0),
});

export const profileItemSchema = baseItemSchema.extend({
	icon: iconSchema,
	network: z.string().min(1),
	username: z.string(),
	website: urlSchema,
});

export const projectItemSchema = baseItemSchema.extend({
	name: z.string().min(1),
	period: z.string(),
	website: urlSchema,
	description: z.string(),
});

export const publicationItemSchema = baseItemSchema.extend({
	title: z.string().min(1),
	publisher: z.string(),
	date: z.string(),
	website: urlSchema,
	description: z.string(),
});

export const referenceItemSchema = baseItemSchema.extend({
	name: z.string().min(1),
	description: z.string(),
});

export const skillItemSchema = baseItemSchema.extend({
	icon: iconSchema,
	name: z.string().min(1),
	proficiency: z.string(),
	level: z.number().min(0).max(5).catch(0),
	keywords: z.array(z.string()).catch([]),
});

export const volunteerItemSchema = baseItemSchema.extend({
	organization: z.string().min(1),
	location: z.string(),
	period: z.string(),
	website: urlSchema,
	description: z.string(),
});

export const baseSectionSchema = z.object({
	title: z.string(),
	columns: z.number(),
	hidden: z.boolean(),
});

export const awardsSectionSchema = baseSectionSchema.extend({
	items: z.array(awardItemSchema),
});

export const certificationsSectionSchema = baseSectionSchema.extend({
	items: z.array(certificationItemSchema),
});

export const educationSectionSchema = baseSectionSchema.extend({
	items: z.array(educationItemSchema),
});

export const experienceSectionSchema = baseSectionSchema.extend({
	items: z.array(experienceItemSchema),
});

export const interestsSectionSchema = baseSectionSchema.extend({
	items: z.array(interestItemSchema),
});

export const languagesSectionSchema = baseSectionSchema.extend({
	items: z.array(languageItemSchema),
});

export const profilesSectionSchema = baseSectionSchema.extend({
	items: z.array(profileItemSchema),
});

export const projectsSectionSchema = baseSectionSchema.extend({
	items: z.array(projectItemSchema),
});

export const publicationsSectionSchema = baseSectionSchema.extend({
	items: z.array(publicationItemSchema),
});

export const referencesSectionSchema = baseSectionSchema.extend({
	items: z.array(referenceItemSchema),
});

export const skillsSectionSchema = baseSectionSchema.extend({
	items: z.array(skillItemSchema),
});

export const volunteerSectionSchema = baseSectionSchema.extend({
	items: z.array(volunteerItemSchema),
});

export const sectionsSchema = z.object({
	profiles: profilesSectionSchema,
	experience: experienceSectionSchema,
	education: educationSectionSchema,
	projects: projectsSectionSchema,
	skills: skillsSectionSchema,
	languages: languagesSectionSchema,
	interests: interestsSectionSchema,
	awards: awardsSectionSchema,
	certifications: certificationsSectionSchema,
	publications: publicationsSectionSchema,
	volunteer: volunteerSectionSchema,
	references: referencesSectionSchema,
});

export type SectionType = keyof z.infer<typeof sectionsSchema>;
export type SectionData = z.infer<typeof sectionsSchema>[SectionType];
export type SectionItem = SectionData["items"][number];

export const customSectionSchema = baseSectionSchema.extend({
	id: z.string(),
	content: z.string(),
});

export const customSectionsSchema = z.array(customSectionSchema);

export const typographySchema = z.object({
	fontFamily: z.string(),
	fontVariants: z.string(),
	fontSize: z.number(),
	lineHeight: z.number(),
});

export const metadataSchema = z.object({
	template: z.string(),
	layout: z.object({
		main: z.array(z.string()),
		aside: z.array(z.string()),
	}),
	css: z.object({
		enabled: z.boolean(),
		value: z.string(),
	}),
	page: z.object({
		marginX: z.number(),
		marginY: z.number(),
		format: z.enum(["a4", "letter"]),
	}),
	theme: z.object({
		background: z.string(),
		text: z.string(),
		accent: z.string(),
	}),
	typography: z.object({
		body: typographySchema,
		heading: typographySchema,
	}),
	notes: z.string(),
});

export const resumeDataSchema = z.object({
	picture: pictureSchema,
	basics: basicsSchema,
	summary: summarySchema,
	sections: sectionsSchema,
	customSections: customSectionsSchema,
	metadata: metadataSchema,
});

export type ResumeData = z.infer<typeof resumeDataSchema>;

export const defaultResumeData: ResumeData = {
	picture: {
		url: "",
		size: 64,
		aspectRatio: 1,
		borderRadius: 0,
		hidden: false,
		shadow: false,
		grayscale: false,
		border: { width: 4, color: "rgba(0, 0, 0, 1)", style: "solid" },
	},
	basics: {
		name: "",
		headline: "",
		email: "",
		phone: "",
		location: "",
		website: { url: "", label: "" },
		customFields: [],
	},
	summary: {
		title: "Summary",
		columns: 1,
		hidden: false,
		content: "",
	},
	sections: {
		profiles: {
			title: "Profiles",
			columns: 1,
			hidden: false,
			items: [],
		},
		experience: {
			title: "Experience",
			columns: 1,
			hidden: false,
			items: [],
		},
		education: {
			title: "Education",
			columns: 1,
			hidden: false,
			items: [],
		},
		projects: {
			title: "Projects",
			columns: 1,
			hidden: false,
			items: [],
		},
		skills: {
			title: "Skills",
			columns: 1,
			hidden: false,
			items: [],
		},
		languages: {
			title: "Languages",
			columns: 1,
			hidden: false,
			items: [],
		},
		interests: {
			title: "Interests",
			columns: 1,
			hidden: false,
			items: [],
		},
		awards: {
			title: "Awards",
			columns: 1,
			hidden: false,
			items: [],
		},
		certifications: {
			title: "Certifications",
			columns: 1,
			hidden: false,
			items: [],
		},
		publications: {
			title: "Publications",
			columns: 1,
			hidden: false,
			items: [],
		},
		volunteer: {
			title: "Volunteer",
			columns: 1,
			hidden: false,
			items: [],
		},
		references: {
			title: "References",
			columns: 1,
			hidden: false,
			items: [],
		},
	},
	customSections: [],
	metadata: {
		template: "",
		layout: { main: [], aside: [] },
		css: { enabled: false, value: "" },
		page: { marginX: 18, marginY: 18, format: "a4" },
		theme: { background: "#ffffff", text: "#000000", accent: "#dc2626" },
		typography: {
			body: {
				fontFamily: "IBM Plex Serif",
				fontVariants: "regular",
				fontSize: 16,
				lineHeight: 1.5,
			},
			heading: {
				fontFamily: "IBM Plex Serif",
				fontVariants: "regular",
				fontSize: 16,
				lineHeight: 1.5,
			},
		},
		notes: "",
	},
};

export const sampleResumeData: ResumeData = {
	picture: {
		url: "https://i.pravatar.cc/300",
		size: 64,
		aspectRatio: 1,
		borderRadius: 50,
		hidden: false,
		shadow: false,
		grayscale: false,
		border: {
			width: 2,
			color: "rgba(59, 130, 246, 1)",
			style: "solid",
		},
	},
	basics: {
		name: "Sarah Chen",
		headline: "Senior Full-Stack Developer & Technical Lead",
		email: "sarah.chen@email.com",
		phone: "+1 (555) 123-4567",
		location: "San Francisco, CA",
		website: {
			url: "https://sarahchen.dev",
			label: "sarahchen.dev",
		},
		customFields: [
			{
				id: "linkedin",
				icon: "linkedin-logo",
				text: "linkedin.com/in/sarahchen",
			},
			{
				id: "github",
				icon: "github-logo",
				text: "github.com/sarahchen",
			},
			{
				id: "portfolio",
				icon: "globe",
				text: "portfolio.sarahchen.dev",
			},
		],
	},
	summary: {
		title: "Professional Summary",
		columns: 1,
		hidden: false,
		content:
			"<p>Experienced full-stack developer with 8+ years of expertise in building scalable web applications. Specialized in React, TypeScript, Node.js, and cloud infrastructure. Proven track record of leading cross-functional teams, architecting microservices, and delivering high-impact products used by millions of users. Passionate about developer experience, code quality, and mentoring junior engineers.</p>",
	},
	sections: {
		profiles: {
			title: "Online Profiles",
			columns: 2,
			hidden: false,
			items: [
				{
					id: "profile-1",
					hidden: false,
					icon: "linkedin-logo",
					network: "LinkedIn",
					username: "sarahchen",
					website: {
						url: "https://linkedin.com/in/sarahchen",
						label: "linkedin.com/in/sarahchen",
					},
				},
				{
					id: "profile-2",
					hidden: false,
					icon: "github-logo",
					network: "GitHub",
					username: "sarahchen",
					website: {
						url: "https://github.com/sarahchen",
						label: "github.com/sarahchen",
					},
				},
				{
					id: "profile-3",
					hidden: false,
					icon: "twitter-logo",
					network: "Twitter",
					username: "@sarahcodes",
					website: {
						url: "https://twitter.com/sarahcodes",
						label: "twitter.com/sarahcodes",
					},
				},
			],
		},
		experience: {
			title: "Work Experience",
			columns: 1,
			hidden: false,
			items: [
				{
					id: "experience-1",
					hidden: false,
					company: "TechFlow Inc.",
					position: "Senior Full-Stack Engineer & Tech Lead",
					location: "San Francisco, CA",
					period: "January 2021 - Present",
					website: {
						url: "https://techflow.com",
						label: "techflow.com",
					},
					description:
						"Leading a team of 6 engineers developing a real-time collaboration platform serving 2M+ users. Architected microservices infrastructure using Node.js, TypeScript, and Kubernetes. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and conducted technical interviews. Key technologies: React, TypeScript, GraphQL, PostgreSQL, Redis, AWS.",
				},
				{
					id: "experience-2",
					hidden: false,
					company: "DataSync Solutions",
					position: "Full-Stack Developer",
					location: "Seattle, WA",
					period: "March 2019 - December 2020",
					website: {
						url: "https://datasync.io",
						label: "datasync.io",
					},
					description:
						"Developed and maintained data integration platform connecting 50+ third-party APIs. Built responsive web applications using React and TypeScript. Optimized database queries improving performance by 40%. Collaborated with product managers and designers in agile environment. Technologies: React, Node.js, Express, MongoDB, Docker.",
				},
				{
					id: "experience-3",
					hidden: false,
					company: "StartupLab",
					position: "Junior Software Developer",
					location: "Austin, TX",
					period: "June 2017 - February 2019",
					website: {
						url: "https://startuplab.co",
						label: "startuplab.co",
					},
					description:
						"Contributed to multiple client projects building custom web applications. Implemented RESTful APIs and database schemas. Participated in code reviews and pair programming sessions. Gained experience in full software development lifecycle. Stack: JavaScript, React, Python, Django, PostgreSQL.",
				},
			],
		},
		education: {
			title: "Education",
			columns: 1,
			hidden: false,
			items: [
				{
					id: "education-1",
					hidden: false,
					school: "University of California, Berkeley",
					degree: "Bachelor of Science",
					area: "Computer Science",
					grade: "3.8 GPA",
					location: "Berkeley, CA",
					period: "September 2013 - May 2017",
					website: {
						url: "https://berkeley.edu",
						label: "berkeley.edu",
					},
					description:
						"Relevant coursework: Data Structures, Algorithms, Database Systems, Web Development, Machine Learning, Software Engineering. Dean's List all semesters. Member of ACM and Women in Computer Science.",
				},
				{
					id: "education-2",
					hidden: false,
					school: "Stanford University",
					degree: "Certificate",
					area: "Machine Learning Specialization",
					grade: "",
					location: "Online",
					period: "January 2022 - June 2022",
					website: {
						url: "https://online.stanford.edu",
						label: "online.stanford.edu",
					},
					description:
						"Completed intensive program covering supervised learning, neural networks, and practical ML implementation. Final project: Built recommendation system achieving 92% accuracy.",
				},
			],
		},
		projects: {
			title: "Notable Projects",
			columns: 1,
			hidden: false,
			items: [
				{
					id: "project-1",
					hidden: false,
					name: "DevCollab - Real-time Code Collaboration Tool",
					period: "2023",
					website: {
						url: "https://github.com/sarahchen/devcollab",
						label: "github.com/sarahchen/devcollab",
					},
					description:
						"Open-source real-time collaborative code editor with video chat integration. Built with React, WebRTC, and operational transformation algorithms. 2.5K GitHub stars, featured in JavaScript Weekly.",
				},
				{
					id: "project-2",
					hidden: false,
					name: "TaskFlow - Project Management API",
					period: "2022",
					website: {
						url: "https://github.com/sarahchen/taskflow",
						label: "github.com/sarahchen/taskflow",
					},
					description:
						"RESTful API for project management with advanced filtering and analytics. Implemented with Node.js, Express, PostgreSQL, and Redis caching. Comprehensive documentation and test coverage >90%.",
				},
				{
					id: "project-3",
					hidden: false,
					name: "UI Component Library",
					period: "2021-Present",
					website: {
						url: "https://components.sarahchen.dev",
						label: "components.sarahchen.dev",
					},
					description:
						"Accessible, customizable React component library with TypeScript support. Published to NPM with 15K+ weekly downloads. Includes Storybook documentation and comprehensive testing suite.",
				},
			],
		},
		skills: {
			title: "Technical Skills",
			columns: 2,
			hidden: false,
			items: [
				{
					id: "skill-1",
					hidden: false,
					icon: "file-js",
					name: "JavaScript (ES2021+)",
					proficiency: "Expert",
					level: 5,
					keywords: ["ES2021 Features", "Asynchronous", "Promises", "Event Loop"],
				},
				{
					id: "skill-2",
					hidden: false,
					icon: "file-ts",
					name: "TypeScript",
					proficiency: "Expert",
					level: 5,
					keywords: ["Types", "Generics", "Type Safety", "Type Guards"],
				},
				{
					id: "skill-3",
					hidden: false,
					icon: "atom",
					name: "React",
					proficiency: "Expert",
					level: 5,
					keywords: ["Hooks", "Context API", "State Management", "Component Design"],
				},
				{
					id: "skill-4",
					hidden: false,
					icon: "function",
					name: "Next.js",
					proficiency: "Advanced",
					level: 4,
					keywords: ["SSR", "Static Generation", "API Routes", "App Router"],
				},
				{
					id: "skill-5",
					hidden: false,
					icon: "leaf",
					name: "Node.js",
					proficiency: "Advanced",
					level: 4,
					keywords: ["Express", "Performance", "REST APIs", "CLI Tools"],
				},
				{
					id: "skill-6",
					hidden: false,
					icon: "database",
					name: "PostgreSQL",
					proficiency: "Advanced",
					level: 4,
					keywords: ["Query Optimization", "Indices", "JSONB", "Migrations"],
				},
			],
		},
		languages: {
			title: "Languages",
			columns: 2,
			hidden: false,
			items: [
				{
					id: "language-1",
					hidden: false,
					language: "English",
					fluency: "Native",
					level: 5,
				},
				{
					id: "language-2",
					hidden: false,
					language: "Mandarin Chinese",
					fluency: "Native",
					level: 5,
				},
				{
					id: "language-3",
					hidden: false,
					language: "Spanish",
					fluency: "Professional Working",
					level: 3,
				},
			],
		},
		interests: {
			title: "Interests",
			columns: 2,
			hidden: false,
			items: [
				{
					id: "interest-1",
					hidden: false,
					icon: "github-logo",
					name: "Open Source Contribution",
					keywords: ["GitHub", "Pull Requests", "Community"],
				},
				{
					id: "interest-2",
					hidden: false,
					icon: "pen-nib",
					name: "Technical Writing",
					keywords: ["Documentation", "Blogging", "Content Creation"],
				},
				{
					id: "interest-3",
					hidden: false,
					icon: "mountains",
					name: "Rock Climbing",
					keywords: ["Bouldering", "Sport Climbing", "Outdoor Activities"],
				},
				{
					id: "interest-4",
					hidden: false,
					icon: "camera",
					name: "Photography",
					keywords: ["Travel", "Portrait", "Landscape"],
				},
				{
					id: "interest-5",
					hidden: false,
					icon: "cooking-pot",
					name: "Cooking",
					keywords: ["International Cuisine", "Recipe Development", "Home Cooking"],
				},
				{
					id: "interest-6",
					hidden: false,
					icon: "chalkboard-teacher",
					name: "Mentoring",
					keywords: ["Women in Tech", "Peer Mentorship", "Coaching"],
				},
			],
		},
		awards: {
			title: "Awards & Recognition",
			columns: 1,
			hidden: false,
			items: [
				{
					id: "award-1",
					hidden: false,
					title: "Tech Excellence Award",
					awarder: "TechFlow Inc.",
					date: "December 2023",
					website: {
						url: "",
						label: "",
					},
					description:
						"Recognized for outstanding technical leadership and significant contributions to platform scalability improvements that reduced infrastructure costs by 35%.",
				},
				{
					id: "award-2",
					hidden: false,
					title: "Best Open Source Project",
					awarder: "DevCon 2023",
					date: "June 2023",
					website: {
						url: "https://devcon.tech",
						label: "devcon.tech",
					},
					description:
						"DevCollab project won first place in open source category at annual developer conference, competing against 150+ projects.",
				},
				{
					id: "award-3",
					hidden: false,
					title: "Hackathon Winner - FinTech Challenge",
					awarder: "San Francisco Tech Week",
					date: "October 2022",
					website: {
						url: "https://sftechweek.com",
						label: "sftechweek.com",
					},
					description:
						"Led team of 4 to build AI-powered financial literacy app in 48 hours. Won $10K prize and mentorship opportunity with venture capital firm.",
				},
			],
		},
		certifications: {
			title: "Certifications",
			columns: 2,
			hidden: false,
			items: [
				{
					id: "certification-1",
					hidden: false,
					title: "AWS Certified Solutions Architect - Associate",
					issuer: "Amazon Web Services",
					date: "March 2023",
					website: {
						url: "https://aws.amazon.com/certification",
						label: "AWS Certification",
					},
					description:
						"Demonstrated expertise in designing distributed systems on AWS platform, including compute, networking, storage, and database services.",
				},
				{
					id: "certification-2",
					hidden: false,
					title: "Kubernetes Administrator (CKA)",
					issuer: "Cloud Native Computing Foundation",
					date: "September 2022",
					website: {
						url: "https://www.cncf.io/certification/cka",
						label: "CNCF Certification",
					},
					description:
						"Certified in deploying, managing, and troubleshooting Kubernetes clusters in production environments.",
				},
				{
					id: "certification-3",
					hidden: false,
					title: "Professional Scrum Master I (PSM I)",
					issuer: "Scrum.org",
					date: "January 2021",
					website: {
						url: "https://www.scrum.org/assessments/professional-scrum-master-i-certification",
						label: "Scrum.org",
					},
					description:
						"Validated understanding of Scrum framework, roles, events, and artifacts for effective agile project management.",
				},
			],
		},
		publications: {
			title: "Publications",
			columns: 1,
			hidden: false,
			items: [
				{
					id: "publication-1",
					hidden: false,
					title: "Scaling Real-Time Collaboration with WebRTC and OT",
					publisher: "Smashing Magazine",
					date: "April 2023",
					website: {
						url: "https://www.smashingmagazine.com/2023/04/scaling-realtime-collaboration-webrtc-ot/",
						label: "smashingmagazine.com/2023/04/scaling-realtime-collaboration-webrtc-ot/",
					},
					description:
						"Explored architecture, challenges, and best practices for building scalable collaborative applications using WebRTC and operational transformation algorithms, based on lessons learned from DevCollab.",
				},
				{
					id: "publication-2",
					hidden: false,
					title: "Designing Accessible React Component Libraries",
					publisher: "DEV Community",
					date: "October 2022",
					website: {
						url: "https://dev.to/sarahchen/designing-accessible-react-component-libraries-4j2h",
						label: "dev.to/sarahchen/designing-accessible-react-component-libraries-4j2h",
					},
					description:
						"Discussed key strategies for building accessible, tested, and customizable UI components for React, with a focus on usability and open-source processes.",
				},
				{
					id: "publication-3",
					hidden: false,
					title: "Modern Project Management APIs in Node.js",
					publisher: "Javascript Weekly",
					date: "July 2022",
					website: {
						url: "https://javascriptweekly.com/issues/599#feature",
						label: "javascriptweekly.com/issues/599#feature",
					},
					description:
						"Featured article detailing the design, implementation, and test strategies behind the TaskFlow API, including performance and analytics considerations.",
				},
			],
		},
		volunteer: {
			title: "Volunteer",
			columns: 1,
			hidden: false,
			items: [
				{
					id: "volunteer-1",
					hidden: false,
					organization: "Open Source Mentorship Program",
					location: "Remote",
					period: "2021 - Present",
					website: {
						url: "https://opensourcementor.org",
						label: "opensourcementor.org",
					},
					description:
						"Mentor emerging developers worldwide on contributions to React and Node.js projects, helping them gain confidence and technical proficiency in open source.",
				},
				{
					id: "volunteer-2",
					hidden: false,
					organization: "Women Who Code San Francisco",
					location: "San Francisco, CA",
					period: "2019 - Present",
					website: {
						url: "https://womenwhocode.com/sf",
						label: "womenwhocode.com/sf",
					},
					description:
						"Lead career workshops and technical sessions focused on empowering women in technology, including talks on cloud architecture and agile development.",
				},
				{
					id: "volunteer-3",
					hidden: false,
					organization: "Local Food Bank",
					location: "San Francisco, CA",
					period: "2018 - 2020",
					website: {
						url: "",
						label: "",
					},
					description:
						"Volunteered in weekend food drives, supporting logistics and community outreach to serve underprivileged neighborhoods.",
				},
			],
		},
		references: {
			title: "References",
			columns: 1,
			hidden: false,
			items: [
				{
					id: "reference-1",
					hidden: false,
					name: "Michael Rodriguez - Engineering Manager at TechFlow Inc.",
					description:
						"Sarah is an exceptional technical leader who consistently delivers high-quality work. Her ability to mentor junior engineers while architecting complex systems is remarkable. She's been instrumental in our platform's success.",
				},
				{
					id: "reference-2",
					hidden: false,
					name: "Jennifer Liu - CTO at DataSync Solutions",
					description:
						"Working with Sarah was a pleasure. She quickly became one of our most reliable engineers, tackling challenging problems with creativity and precision. Her communication skills and technical expertise made her invaluable to our team.",
				},
			],
		},
	},
	customSections: [],
	metadata: {
		template: "modern",
		layout: {
			main: ["summary", "experience", "projects", "volunteering"],
			aside: [
				"skills",
				"education",
				"certifications",
				"awards",
				"languages",
				"interests",
				"publications",
				"references",
			],
		},
		css: {
			enabled: false,
			value: "",
		},
		page: {
			marginX: 18,
			marginY: 18,
			format: "a4",
		},
		theme: {
			background: "#ffffff",
			text: "#1f2937",
			accent: "#3b82f6",
		},
		typography: {
			body: {
				fontFamily: "Inter",
				fontVariants: "400",
				fontSize: 16,
				lineHeight: 1.5,
			},
			heading: {
				fontFamily: "Inter",
				fontVariants: "600",
				fontSize: 20,
				lineHeight: 1.5,
			},
		},
		notes:
			"Resume for senior full-stack developer positions. Emphasis on technical leadership and open source contributions. Please note that these notes are for my own reference and are not displayed in the resume.",
	},
};
