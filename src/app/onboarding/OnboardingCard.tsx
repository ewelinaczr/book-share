"use client";
import React from "react";
import { Step } from "nextstepjs";
import styles from "./OnboardingCard.module.css";
import Button, { ButtonType } from "@/components/buttons/Button";
import { useTranslations } from "next-intl";

interface OnboardingCardProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  skipTour?: () => void;
  arrow: React.ReactNode;
}

const OnboardingCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: OnboardingCardProps) => {
  const t = useTranslations();
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {step.icon && <div className={styles.icon}>{step.icon}</div>}
        <h3 className={styles.title}>{step.title}</h3>
      </div>

      <div className={styles.content}>{step.content}</div>

      {arrow}

      <div className={styles.footer}>
        <div className={styles.stepInfo}>
          {t("onboarding_step", {
            currentStep: currentStep + 1,
            totalSteps: totalSteps,
          })}
        </div>

        <div className={styles.actions}>
          <div className={styles.navigationButtons}>
            {currentStep > 0 && (
              <Button
                type="submit"
                ariaLabel="Next onboarding step"
                buttonType={ButtonType.SECONDARY}
                onClick={prevStep}
                customStyles={{ minWidth: "13rem", height: "2.5rem" }}
              >
                {t("onboarding_previous")}
              </Button>
            )}
            <Button
              type="submit"
              ariaLabel="Next onboarding step"
              buttonType={ButtonType.PRIMARY}
              onClick={nextStep}
              customStyles={{ minWidth: "13rem", height: "2.5rem" }}
            >
              {currentStep === totalSteps - 1
                ? t("onboarding_finish")
                : t("onboarding_next")}
            </Button>
          </div>
          {step.showSkip && (
            <Button
              type="submit"
              ariaLabel="Skip onboarding tour"
              buttonType={ButtonType.SECONDARY}
              onClick={skipTour}
              customStyles={{ height: "2.5rem" }}
            >
              {t("onboarding_skip")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingCard;
