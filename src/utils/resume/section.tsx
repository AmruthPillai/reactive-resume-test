import { t } from "@lingui/core/macro";
import {
	ArticleIcon,
	BooksIcon,
	BriefcaseIcon,
	CertificateIcon,
	CodeSimpleIcon,
	CompassToolIcon,
	FootballIcon,
	GraduationCapIcon,
	HandHeartIcon,
	type IconProps,
	MessengerLogoIcon,
	PhoneIcon,
	StarIcon,
	TranslateIcon,
	TrophyIcon,
	UserIcon,
} from "@phosphor-icons/react";
import { match } from "ts-pattern";
import type { ExtendedSectionType } from "@/schema/resume/data";
import { cn } from "../style";

export const getSectionTitle = (type: ExtendedSectionType): string => {
	return match(type)
		.with("basics", () => t`Basics`)
		.with("summary", () => t`Summary`)
		.with("profiles", () => t`Profiles`)
		.with("experience", () => t`Experience`)
		.with("education", () => t`Education`)
		.with("projects", () => t`Projects`)
		.with("skills", () => t`Skills`)
		.with("languages", () => t`Languages`)
		.with("interests", () => t`Interests`)
		.with("awards", () => t`Awards`)
		.with("certifications", () => t`Certifications`)
		.with("publications", () => t`Publications`)
		.with("volunteer", () => t`Volunteer`)
		.with("references", () => t`References`)
		.with("custom", () => t`Custom Sections`)
		.exhaustive();
};

export const getSectionIcon = (type: ExtendedSectionType, props?: IconProps): React.ReactNode => {
	const iconProps = { ...props, className: cn("shrink-0", props?.className) };

	return match(type)
		.with("basics", () => <UserIcon {...iconProps} />)
		.with("summary", () => <ArticleIcon {...iconProps} />)
		.with("profiles", () => <MessengerLogoIcon {...iconProps} />)
		.with("experience", () => <BriefcaseIcon {...iconProps} />)
		.with("education", () => <GraduationCapIcon {...iconProps} />)
		.with("projects", () => <CodeSimpleIcon {...iconProps} />)
		.with("skills", () => <CompassToolIcon {...iconProps} />)
		.with("languages", () => <TranslateIcon {...iconProps} />)
		.with("interests", () => <FootballIcon {...iconProps} />)
		.with("awards", () => <TrophyIcon {...iconProps} />)
		.with("certifications", () => <CertificateIcon {...iconProps} />)
		.with("publications", () => <BooksIcon {...iconProps} />)
		.with("volunteer", () => <HandHeartIcon {...iconProps} />)
		.with("references", () => <PhoneIcon {...iconProps} />)
		.with("custom", () => <StarIcon {...iconProps} />)
		.exhaustive();
};
