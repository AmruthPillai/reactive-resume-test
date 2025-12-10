import z from "zod";
import type { IconName } from "@/components/input/icon-picker";
import type { Locale } from "@/utils/locale";

export const iconSchema = z.custom<IconName>();

export const localeSchema = z.custom<Locale>();

export const urlSchema = z.object({
	url: z.url().or(z.literal("")),
	label: z.string(),
});

export const pictureSchema = z.object({
	hidden: z.boolean(),
	url: z.url().or(z.literal("")),
	size: z.number().min(32).max(512),
	rotation: z.number().min(0).max(360),
	aspectRatio: z.number().min(0.5).max(2.5),
	borderRadius: z.number().min(0).max(50),
	borderColor: z.string(),
	borderWidth: z.number().min(0),
	shadowColor: z.string(),
	shadowWidth: z.number().min(0),
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
export type SectionData<T extends SectionType = SectionType> = z.infer<typeof sectionsSchema>[T];
export type SectionItem<T extends SectionType = SectionType> = SectionData<T>["items"][number];

export const customSectionSchema = baseSectionSchema.extend({
	id: z.string(),
	content: z.string(),
});

export type CustomSection = z.infer<typeof customSectionSchema>;

export const customSectionsSchema = z.array(customSectionSchema);

export const fontWeightSchema = z.enum(["100", "200", "300", "400", "500", "600", "700", "800", "900"]);

export const typographyItemSchema = z.object({
	fontFamily: z.string(),
	fontWeights: z.array(fontWeightSchema).catch(["400"]),
	fontSize: z.number().min(6).max(24).catch(11),
	lineHeight: z.number().min(0.5).max(4).catch(1.5),
});

export const pageLayoutSchema = z.object({
	fullWidth: z.boolean(),
	main: z.array(z.string()),
	sidebar: z.array(z.string()),
});

export const layoutSchema = z.object({
	sidebarWidth: z.number().min(10).max(50).catch(30),
	pages: z.array(pageLayoutSchema),
});

export const cssSchema = z.object({
	enabled: z.boolean(),
	value: z.string(),
});

export const pageSchema = z.object({
	marginX: z.number(),
	marginY: z.number(),
	format: z.enum(["a4", "letter"]),
});

export const levelDesignSchema = z.object({
	icon: iconSchema,
	type: z.enum(["hidden", "circle", "square", "rectangle", "rectangle-full", "progress-bar", "icon"]),
});

export const colorDesignSchema = z.object({
	primary: z.string(),
	text: z.string(),
	background: z.string(),
});

export const designSchema = z.object({
	level: levelDesignSchema,
	colors: colorDesignSchema,
});

export const typographySchema = z.object({
	body: typographyItemSchema,
	heading: typographyItemSchema,
});

export const templateSchema = z.enum(["onyx", "ditto", "bronzor", "chikorita"]);

export const metadataSchema = z.object({
	locale: localeSchema.catch("en-US"),
	template: templateSchema.catch("onyx"),
	layout: layoutSchema,
	css: cssSchema,
	page: pageSchema,
	design: designSchema,
	typography: typographySchema,
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
		hidden: false,
		url: "",
		size: 80,
		rotation: 0,
		aspectRatio: 1,
		borderRadius: 0,
		borderColor: "rgba(0, 0, 0, 1)",
		borderWidth: 0,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		shadowWidth: 0,
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
		title: "",
		columns: 1,
		hidden: false,
		content: "",
	},
	sections: {
		profiles: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		experience: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		education: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		projects: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		skills: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		languages: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		interests: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		awards: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		certifications: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		publications: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		volunteer: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
		references: {
			title: "",
			columns: 1,
			hidden: false,
			items: [],
		},
	},
	customSections: [],
	metadata: {
		locale: "en-US",
		template: "onyx",
		layout: {
			sidebarWidth: 30,
			pages: [
				{
					fullWidth: false,
					main: ["profiles", "summary", "education", "experience", "projects", "volunteer", "references"],
					sidebar: ["skills", "certifications", "awards", "languages", "interests", "publications"],
				},
			],
		},
		css: { enabled: false, value: "" },
		page: { marginX: 14, marginY: 16, format: "a4" },
		design: {
			colors: {
				primary: "rgba(220, 38, 38, 1)",
				text: "rgba(0, 0, 0, 1)",
				background: "rgba(255, 255, 255, 1)",
			},
			level: {
				icon: "star",
				type: "rectangle-full",
			},
		},
		typography: {
			body: {
				fontFamily: "IBM Plex Serif",
				fontWeights: ["400", "500"],
				fontSize: 10,
				lineHeight: 1.5,
			},
			heading: {
				fontFamily: "IBM Plex Serif",
				fontWeights: ["600"],
				fontSize: 14,
				lineHeight: 1.5,
			},
		},
		notes: "",
	},
};

export const sampleResumeData: ResumeData = {
	picture: {
		hidden: false,
		url: "https://picsum.photos/800",
		size: 80,
		rotation: 0,
		aspectRatio: 1,
		borderRadius: 0,
		borderColor: "rgba(0, 0, 0, 1)",
		borderWidth: 0,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		shadowWidth: 0,
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
			'<h1>This is a heading 1</h1><h2>This is a heading 2</h2><h3>This is a heading 3</h3><h4>This is a heading 4</h4><h5>This is a heading 5</h5><h6>This is a heading 6</h6><p><strong>Experienced full-stack developer with 8+</strong> years of expert<em>ise in building scalable web applications. Spe</em>cialized in React, Typ<u>eScript, Node.js, and cloud infrastructure. Pro</u>ven track record of le<mark class="bg-yellow-200 group-data-editor:text-zinc-950! rounded-md px-0.5 py-px">ading cross-functional teams, archi</mark>tecting microse<s>rvices, and del</s>ivering <code>high-impact p</code>roducts us<strong><em>ed by millions of users. Passionate about deve</em></strong>loper experience<u>, code quality, and mentoring junior engin</u>eers.</p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://google.com">This is a link.</a></p><ul><li><p>This is a list item.</p></li><li><p>This is another list item.</p><ul><li><p>This is a nested list item.</p><ul><li><p>Here\'s another nested list item.</p></li></ul></li></ul></li><li><p>And we\'re back to the start.</p></li></ul><p style="text-align: justify;">Lorem consequat nisi mollit elit qui reprehenderit nisi. Fugiat dolor pariatur veniam quis cillum amet laborum velit. Aute qui dolore laboris. Eu est nulla pariatur nostrud mollit cupidatat dolor eu elit ad sit culpa laboris tempor ad. Dolore officia quis officia esse velit consectetur duis in non magna mollit quis.</p>',
	},
	sections: {
		profiles: {
			title: "Online Profiles",
			columns: 3,
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
						label: "",
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
						label: "",
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
						label: "",
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
			columns: 3,
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
			columns: 3,
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
			columns: 3,
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
			columns: 1,
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
	customSections: [
		{
			title: "Volunteer Projects",
			columns: 1,
			hidden: false,
			id: "custom-1",
			content:
				"<p>Organized local hackathons for high school students and mentored teams on web development basics.</p>",
		},
		{
			title: "Internships",
			columns: 1,
			hidden: false,
			id: "custom-2",
			content:
				"<p>Completed a 6-month remote internship at Open Source Initiative. Contributed bug fixes and helped review community pull requests.</p>",
		},
	],
	metadata: {
		locale: "en-US",
		template: "onyx",
		layout: {
			sidebarWidth: 30,
			pages: [
				{
					fullWidth: false,
					main: ["summary", "education", "profiles", "skills", "experience", "interests"],
					sidebar: [
						"awards",
						"certifications",
						"languages",
						"projects",
						"volunteer",
						"references",
						"publications",
						"custom-1",
						"custom-2",
					],
				},
			],
		},
		css: {
			enabled: false,
			value: "",
		},
		page: {
			marginX: 14,
			marginY: 16,
			format: "a4",
		},
		design: {
			level: {
				icon: "star",
				type: "icon",
			},
			colors: {
				primary: "rgba(236, 0, 63, 1)",
				text: "rgba(31, 41, 55, 1)",
				background: "rgba(255, 255, 255, 1)",
			},
		},
		typography: {
			body: {
				fontFamily: "IBM Plex Serif",
				fontWeights: ["400", "500"],
				fontSize: 10,
				lineHeight: 1.5,
			},
			heading: {
				fontFamily: "Oswald",
				fontWeights: ["400"],
				fontSize: 16,
				lineHeight: 1.5,
			},
		},
		notes:
			"Resume for senior full-stack developer positions. Emphasis on technical leadership and open source contributions. Please note that these notes are for my own reference and are not displayed in the resume.",
	},
};
