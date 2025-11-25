"use client";
import { NextStepProvider, NextStep, Tour } from "nextstepjs";
import { useCustomNavigationAdapter } from "./customNavigationAdapter";
import OnboardingCard from "./OnboardingCard";
import { useTranslations } from "next-intl";

export default function OnboardingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();

  const steps: Tour[] = [
    {
      tour: "mainTour",
      steps: [
        {
          icon: "",
          title: t("onboarding_step1_title"),
          content: t("onboarding_step1_description"),
          selector: "#nextstep-step1",
          side: "bottom",
          showControls: true,
          showSkip: true,
          nextRoute: "/home",
        },
        {
          icon: "",
          title: t("onboarding_step2_title"),
          content: t("onboarding_step2_description"),
          selector: "#nextstep-step2",
          side: "bottom",
          showControls: true,
          showSkip: true,
        },
        {
          icon: "",
          title: t("onboarding_step3_title"),
          content: t("onboarding_step3_description"),
          selector: "#nextstep-step3",
          side: "bottom",
          showControls: true,
          showSkip: true,
        },
        {
          icon: "",
          title: t("onboarding_step4_title"),
          content: t("onboarding_step4_description"),
          selector: "#nextstep-step4",
          side: "bottom",
          showControls: true,
          showSkip: true,
        },
        {
          icon: "",
          title: t("onboarding_step5_title"),
          content: t("onboarding_step5_description"),
          selector: "#nextstep-step5",
          side: "bottom",
          showControls: true,
          showSkip: true,
        },
        {
          icon: "",
          title: t("onboarding_step6_title"),
          content: t("onboarding_step6_description"),
          selector: "#nextstep-step6",
          side: "bottom",
          showControls: true,
          showSkip: true,
        },
        {
          icon: "",
          title: t("onboarding_step7_title"),
          content: t("onboarding_step7_description"),
          selector: "#nextstep-step7",
          side: "top",
          showControls: true,
          showSkip: true,
        },
        {
          icon: "",
          title: t("onboarding_step8_title"),
          content: t("onboarding_step8_description"),
          selector: "#nextstep-step8",
          side: "bottom",
          showControls: true,
          showSkip: true,
        },
        {
          icon: "",
          title: t("onboarding_step9_title"),
          content: t("onboarding_step9_description"),
          selector: "#nextstep-step9",
          side: "left",
          showControls: true,
          showSkip: true,
          nextRoute: "/bookshelf",
        },
        {
          icon: "",
          title: t("onboarding_step10_title"),
          content: t("onboarding_step10_description"),
          selector: "#nextstep-step10",
          side: "left",
          showControls: true,
          showSkip: true,
          prevRoute: "/home",
        },
        {
          icon: "",
          title: t("onboarding_step11_title"),
          content: t("onboarding_step11_description"),
          selector: "#nextstep-step11",
          side: "top",
          showControls: true,
          showSkip: true,
        },
        {
          icon: "",
          title: t("onboarding_step12_title"),
          content: t("onboarding_step12_description"),
          selector: "#nextstep-step12",
          side: "left",
          showControls: true,
          showSkip: true,
          nextRoute: "/pickUpPoints",
        },
        {
          icon: "",
          title: t("onboarding_step13_title"),
          content: t("onboarding_step13_description"),
          selector: "#nextstep-step13",
          side: "left",
          showControls: true,
          showSkip: true,
          prevRoute: "/bookshelf",
        },
      ],
    },
  ];

  return (
    <NextStepProvider>
      <NextStep
        steps={steps}
        cardComponent={OnboardingCard}
        navigationAdapter={useCustomNavigationAdapter}
      >
        {children}
      </NextStep>
    </NextStepProvider>
  );
}
