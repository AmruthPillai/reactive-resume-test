import { Trans } from "@lingui/react/macro";
import { EyeClosedIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";

type Props = {
	hidden: boolean;
};

export function SectionMask({ hidden }: Props) {
	return (
		<AnimatePresence>
			{hidden && (
				<motion.div
					key="section-mask"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-md bg-background/50 px-4 text-center backdrop-blur-xs"
				>
					<EyeClosedIcon className="size-6" />
					<p className="font-medium">
						<Trans>This section is hidden from the resume.</Trans>
					</p>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
