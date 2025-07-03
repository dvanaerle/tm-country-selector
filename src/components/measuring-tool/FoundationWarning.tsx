import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FOUNDATION_WARNING_THRESHOLD } from "@/hooks/usePassageHeightCalculator";
import AlertLine from "../../../public/icons/MingCute/alert_line.svg";

interface FoundationWarningProps {
  t: ReturnType<typeof useTranslations>;
}

export const FoundationWarning: React.FC<FoundationWarningProps> = ({ t }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
    >
      <Alert variant="warning" className="mt-4">
        <AlertLine aria-hidden="true" />
        <AlertTitle>{t("Form.Common.validationErrors.pleaseNote")}</AlertTitle>
        <AlertDescription>
          {t.rich("Form.WallProfileHeight.foundationWarning", {
            strong: (chunks) => <strong>{chunks}</strong>,
            threshold: FOUNDATION_WARNING_THRESHOLD,
          })}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
