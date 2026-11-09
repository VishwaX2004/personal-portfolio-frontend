import { useState } from "react";
import {
  Award,
  Briefcase,
  Calendar,
  ExternalLink,
  GraduationCap,
  ZoomIn,
} from "lucide-react";

import CertificateLightbox from "./CertificateLightbox";

export default function ExperienceCard({
  experience,
  index,
  isRight,
  useScrollReveal,
}) {
  const [ref, visible] = useScrollReveal();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [failedLogoUrl, setFailedLogoUrl] = useState(null);

  const isEducation = experience.type === "education";
  const isCertificate = experience.type === "certificate";

  let TimelineIcon = GraduationCap;
  if (isCertificate) TimelineIcon = Award;
  else if (experience.type === "experience") TimelineIcon = Briefcase;

  const logoUrl =
    typeof experience.logoUrl === "string" ? experience.logoUrl.trim() : "";

  const certificateImages = Array.isArray(experience.certificateImages)
    ? experience.certificateImages
    : [];

  const educationDates = experience.startYear
    ? `${experience.startYear} – ${experience.endYear || "Present"}`
    : experience.endYear;

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          visible
            ? "translate-x-0 translate-y-0 scale-100 opacity-100"
            : `translate-y-10 scale-[0.97] opacity-0 ${
                isRight ? "md:translate-x-10" : "md:-translate-x-10"
              }`
        }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        aria-hidden="true"
        className={`absolute left-[20px] z-20 flex h-10 w-10 -translate-x-1/2
          items-center justify-center rounded-full border-2 bg-[#080808]
          shadow-lg transition-all duration-700 md:left-1/2 md:h-14 md:w-14
          ${
            isEducation
              ? "border-blue-500 text-blue-400"
              : "border-amber-500 text-amber-400"
          }
          ${visible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
      >
        <div
          className={`absolute inset-1 rounded-full ${
            isEducation ? "bg-blue-500/10" : "bg-amber-500/10"
          }`}
        />
        <TimelineIcon className="relative h-5 w-5 md:h-6 md:w-6" />
      </div>

      <div
        className={`ml-14 min-w-0 md:ml-0 md:w-[calc(50%-40px)] ${
          isRight ? "md:ml-auto" : ""
        }`}
      >
        {isEducation ? (
          <article
            className="rounded-xl border-1.5 border-blue-500/35
              bg-gradient-to-br from-blue-500/12 via-[#111827] to-[#0d121c]
              p-4 sm:p-6 shadow-lg transition-all duration-300
              hover:border-blue-400/55 hover:shadow-xl"
          >
            <div className="flex gap-4 sm:gap-5">
              {/* LOGO - LEFT SIDE */}
              <div
                className="flex h-28 w-28 sm:h-32 sm:w-32 shrink-0 items-center justify-center
                  rounded-xl border-2 border-blue-500/45 bg-gradient-to-br from-blue-500/20 to-blue-600/10
                  p-2 shadow-lg"
              >
                {logoUrl && failedLogoUrl !== logoUrl ? (
                  <img
                    key={logoUrl}
                    src={logoUrl}
                    alt=""
                    className="h-full w-full object-cover rounded-lg"
                    onError={() => setFailedLogoUrl(logoUrl)}
                  />
                ) : (
                  <GraduationCap
                    aria-hidden="true"
                    className="h-12 w-12 text-blue-300"
                  />
                )}
              </div>

              {/* INFO - RIGHT SIDE - STACKED VERTICALLY */}
              <div className="min-w-0 flex-1 flex flex-col justify-center space-y-2">
                <span
                  className="inline-flex w-fit rounded-full border border-blue-400/35
                    bg-blue-500/20 px-2.5 py-1 text-[10px] font-bold
                    uppercase tracking-wide text-blue-300"
                >
                  🎓 Education
                </span>

                <h3
                  className="break-words text-lg sm:text-xl font-bold leading-snug
                    tracking-tight text-white"
                >
                  {experience.degree}
                </h3>

                {experience.institution && (
                  <p className="break-words text-sm font-semibold text-blue-300">
                    {experience.institution}
                  </p>
                )}

                {experience.field && (
                  <p className="break-words text-sm font-medium text-gray-300">
                    {experience.field}
                  </p>
                )}

                {educationDates && (
                  <div className="flex items-center gap-2 pt-1">
                    <Calendar size={14} className="text-blue-400 flex-shrink-0" />
                    <p className="break-words text-sm font-medium text-gray-300">
                      {educationDates}
                    </p>
                  </div>
                )}

                {experience.description && (
                  <p className="break-words text-sm leading-relaxed text-gray-300 pt-1 line-clamp-3">
                    {experience.description}
                  </p>
                )}
              </div>
            </div>
          </article>
        ) : (
          <div
            className="group relative overflow-hidden rounded-xl border border-amber-500/28
              bg-gradient-to-br from-amber-500/10 to-transparent p-4 sm:p-5
              shadow-md transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20
                h-40 w-40 rounded-full bg-amber-500/10 opacity-0
                blur-[80px] transition-opacity duration-700
                group-hover:opacity-100"
            />

            <div className="relative mb-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40
                  bg-amber-500/18 px-2.5 py-1 text-[10px]
                  font-bold uppercase tracking-wide text-amber-400"
              >
                🏆 Certificate
              </span>
            </div>

            {isCertificate && certificateImages.length > 0 && (
              <div className="relative my-2">
                <button
                  type="button"
                  aria-label="View certificate at full size"
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                  className="group/img relative mb-1.5 block aspect-video w-full
                    overflow-hidden rounded-lg border border-amber-500/30
                    transition-all duration-300 hover:scale-105
                    hover:border-amber-500/50 hover:shadow-md"
                >
                  <img
                    src={certificateImages[0]}
                    alt="Certificate"
                    className="h-full w-full object-cover transition-all
                      duration-300 group-hover/img:brightness-110"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center
                      transition-colors duration-300 group-hover/img:bg-black/15"
                  >
                    <ZoomIn
                      aria-hidden="true"
                      size={20}
                      className="text-white opacity-0 transition-opacity
                        duration-300 group-hover/img:opacity-100"
                    />
                  </div>
                </button>

                {certificateImages.length > 1 && (
                  <div className="flex gap-1 overflow-x-auto pb-1">
                    {certificateImages.map((imageUrl, imageIndex) => (
                      <button
                        key={`${imageUrl}-${imageIndex}`}
                        type="button"
                        aria-label={`View certificate image ${imageIndex + 1}`}
                        onClick={() => {
                          setLightboxIndex(imageIndex);
                          setLightboxOpen(true);
                        }}
                        className="h-10 w-10 shrink-0 overflow-hidden rounded-md
                          border border-amber-500/20 transition-colors
                          duration-300 hover:border-amber-500/50"
                      >
                        <img
                          src={imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                <CertificateLightbox
                  images={certificateImages}
                  isOpen={lightboxOpen}
                  onClose={() => setLightboxOpen(false)}
                  initialIndex={lightboxIndex}
                />
              </div>
            )}

            {isCertificate && (
              <div className="relative space-y-1.5">
                <h3 className="line-clamp-2 text-sm font-bold tracking-tight text-white">
                  {experience.degree}
                </h3>

                <p className="text-xs font-medium text-amber-300">
                  {experience.field}
                </p>

                <p className="text-xs font-medium text-gray-400">
                  {experience.startYear}
                </p>

                {experience.description && (
                  <p className="text-xs leading-snug text-gray-400">
                    {experience.description}
                  </p>
                )}
              </div>
            )}

            {isCertificate && experience.certificateUrl && (
              <a
                href={experience.certificateUrl}
                target="_blank"
                rel="noreferrer"
                className="relative mt-2 inline-flex items-center gap-1
                  rounded-md border border-amber-500/25 bg-amber-500/10
                  px-2 py-1 text-[10px] font-bold text-amber-400
                  transition-colors duration-300 hover:border-amber-500/50
                  hover:text-amber-300"
              >
                <ExternalLink aria-hidden="true" size={10} />
                View Credential
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}