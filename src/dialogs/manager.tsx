import { match } from "ts-pattern";
import { ChangePasswordDialog } from "./auth/change-password";
import { DisableTwoFactorDialog } from "./auth/disable-two-factor";
import { EnableTwoFactorDialog } from "./auth/enable-two-factor";
import { CreateResumeDialog, DuplicateResumeDialog, UpdateResumeDialog } from "./resume";
import { CreateAwardDialog, UpdateAwardDialog } from "./resume/sections/award";
import { CreateCertificationDialog, UpdateCertificationDialog } from "./resume/sections/certification";
import { CreateCustomSectionDialog, UpdateCustomSectionDialog } from "./resume/sections/custom";
import { CreateEducationDialog, UpdateEducationDialog } from "./resume/sections/education";
import { CreateExperienceDialog, UpdateExperienceDialog } from "./resume/sections/experience";
import { CreateInterestDialog, UpdateInterestDialog } from "./resume/sections/interest";
import { CreateLanguageDialog, UpdateLanguageDialog } from "./resume/sections/language";
import { CreateProfileDialog, UpdateProfileDialog } from "./resume/sections/profile";
import { CreateProjectDialog, UpdateProjectDialog } from "./resume/sections/project";
import { CreatePublicationDialog, UpdatePublicationDialog } from "./resume/sections/publication";
import { CreateReferenceDialog, UpdateReferenceDialog } from "./resume/sections/reference";
import { CreateSkillDialog, UpdateSkillDialog } from "./resume/sections/skill";
import { CreateVolunteerDialog, UpdateVolunteerDialog } from "./resume/sections/volunteer";
import { TemplateGalleryDialog } from "./resume/template/gallery";
import { useDialogStore } from "./store";

export function DialogManager() {
	const { open, activeDialog, onOpenChange } = useDialogStore();

	if (!activeDialog) return null;

	return match(activeDialog)
		.with({ type: "auth.change-password" }, () => <ChangePasswordDialog open={open} onOpenChange={onOpenChange} />)
		.with({ type: "auth.two-factor.enable" }, () => <EnableTwoFactorDialog open={open} onOpenChange={onOpenChange} />)
		.with({ type: "auth.two-factor.disable" }, () => <DisableTwoFactorDialog open={open} onOpenChange={onOpenChange} />)
		.with({ type: "resume.create" }, () => <CreateResumeDialog open={open} onOpenChange={onOpenChange} />)
		.with({ type: "resume.update" }, ({ data }) => (
			<UpdateResumeDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.duplicate" }, ({ data }) => (
			<DuplicateResumeDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.template.gallery" }, () => <TemplateGalleryDialog open={open} onOpenChange={onOpenChange} />)
		.with({ type: "resume.sections.profiles.create" }, ({ data }) => (
			<CreateProfileDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.profiles.update" }, ({ data }) => (
			<UpdateProfileDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.experience.create" }, ({ data }) => (
			<CreateExperienceDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.experience.update" }, ({ data }) => (
			<UpdateExperienceDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.education.create" }, ({ data }) => (
			<CreateEducationDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.education.update" }, ({ data }) => (
			<UpdateEducationDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.skills.create" }, ({ data }) => (
			<CreateSkillDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.skills.update" }, ({ data }) => (
			<UpdateSkillDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.projects.create" }, ({ data }) => (
			<CreateProjectDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.projects.update" }, ({ data }) => (
			<UpdateProjectDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.certifications.create" }, ({ data }) => (
			<CreateCertificationDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.certifications.update" }, ({ data }) => (
			<UpdateCertificationDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.languages.create" }, ({ data }) => (
			<CreateLanguageDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.languages.update" }, ({ data }) => (
			<UpdateLanguageDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.publications.create" }, ({ data }) => (
			<CreatePublicationDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.publications.update" }, ({ data }) => (
			<UpdatePublicationDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.awards.create" }, ({ data }) => (
			<CreateAwardDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.awards.update" }, ({ data }) => (
			<UpdateAwardDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.interests.create" }, ({ data }) => (
			<CreateInterestDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.interests.update" }, ({ data }) => (
			<UpdateInterestDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.volunteer.create" }, ({ data }) => (
			<CreateVolunteerDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.volunteer.update" }, ({ data }) => (
			<UpdateVolunteerDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.references.create" }, ({ data }) => (
			<CreateReferenceDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.references.update" }, ({ data }) => (
			<UpdateReferenceDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.custom.create" }, ({ data }) => (
			<CreateCustomSectionDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.with({ type: "resume.sections.custom.update" }, ({ data }) => (
			<UpdateCustomSectionDialog open={open} onOpenChange={onOpenChange} data={data} />
		))
		.exhaustive();
}
