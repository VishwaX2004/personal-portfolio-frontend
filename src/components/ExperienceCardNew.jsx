import { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  ZoomIn,
  ExternalLink,
} from "lucide-react";
import CertificateLightbox from "./CertificateLightbox";

/**
 * Enhanced ExperienceCard - Shows education and certificate info with logos/images
 * Features: Larger cards, prominent logos, certificate image galleries, better styling
 */
export default function ExperienceCard({
  experience,
  index,
  isRight,
  useScrollReveal,
}) {
  const [ref, visible] = useScrollReveal();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Determine type and colors
  const isEducation = experience.type === "education";
  const isCertificate = experience.type === "certificate";

  let Icon = GraduationCap;
  if (isCertificate) Icon = Award;
  else if (experience.type === "experience") Icon = Briefcase;

  const colorClass = isEducation 
    ? { border: "border-blue-500", bg: "bg-blue-500", text: "text-blue-400", light: "from-blue-500/5" }
    : { border: "border-amber-500", bg: "bg-amber-500", text: "text-amber-400", light: "from-amber-500/5" };

  return (
    <div
      ref={ref}
      className={`
        relative
        transition-all
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          visible
            ? "opacity-100 translate-y-0 translate-x-0 scale-100"
            : `opacity-0 translate-y-10 ${
                isRight ? "md:translate-x-10" : "md:-translate-x-10"
              } scale-[0.97]`
        }
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* TIMELINE DOT - LARGER */}
      <div
        className={`
          absolute
          left-[20px]
          md:left-1/2
          -translate-x-1/2
          w-14
          h-14
          rounded-full
          bg-[#080808]
          border-2
          ${colorClass.border}
          flex
          items-center
          justify-center
          z-20
          transition-all
          duration-700
          ${visible ? "scale-100 opacity-100" : "scale-50 opacity-0"}
          shadow-lg
          ${colorClass.bg}/20
        `}
      >
        <div className={`absolute inset-1 rounded-full ${colorClass.bg}/10`} />
        <Icon size={22} className={`relative z-10 ${colorClass.text}`} />
      </div>

      {/* CARD CONTENT */}
      <div
        className={`
          ml-16
          md:ml-0
          md:w-[calc(50%-40px)]
          ${isRight ? "md:ml-auto" : ""}
        `}
      >
        <div
          className={`
            group
            relative
            overflow-hidden
            rounded-2xl
            border-2
            ${colorClass.border}/30
            bg-gradient-to-br
            ${colorClass.light}
            to-transparent
            backdrop-blur-xl
            p-5
            md:p-6
            transition-all
            duration-500
            hover:-translate-y-4
            ${colorClass.border}/60
            hover:bg-white/[0.08]
            hover:shadow-[0_30px_100px_${isEducation ? 'rgba(37,99,235,0.2)' : 'rgba(217,119,6,0.2)'}]
          `}
        >
          {/* GLOW EFFECT */}
          <div
            className={`
              absolute
              -top-24
              -right-24
              w-56
              h-56
              rounded-full
              ${colorClass.bg}/[0.1]
              blur-[100px]
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-700
              pointer-events-none
            `}
          />

          {/* TOP GRADIENT LINE */}
          <div
            className={`
              absolute
              top-0
              left-8
              right-8
              h-px
              bg-gradient-to-r
              ${colorClass.text}/50
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-500
            `}
          />

          {/* HEADER WITH LOGO AND BADGE */}
          <div className="flex items-start justify-between mb-3 gap-4">
            {/* LOGO - LARGE FOR EDUCATION */}
            {isEducation && experience.logoUrl && typeof experience.logoUrl === "string" && (
              <div className="relative flex-shrink-0">
                <img
                  src={experience.logoUrl}
                  alt={`${experience.institution || "Institution"} logo`}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover border-2 border-blue-500/30 shadow-lg hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500/20 to-transparent pointer-events-none" />
              </div>
            )}

            {/* BADGE */}
            <span
              className={`
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                ${colorClass.bg}/10
                border
                ${colorClass.border}/20
                ${colorClass.text}
                text-xs
                font-bold
                uppercase
                tracking-[0.15em]
              `}
            >
              {isEducation ? "🎓 Education" : "🏆 Certificate"}
            </span>
          </div>

          {/* INSTITUTION/ISSUER - PROMINENT */}
          <p
            className={`
              text-xs
              font-bold
              ${colorClass.text}
              mb-1
              uppercase
              tracking-[0.2em]
              opacity-90
            `}
          >
            {experience.institution || experience.field}
          </p>

          {/* DEGREE/CERTIFICATE NAME - BIG & BOLD */}
          <h3
            className="
              text-xl
              md:text-2xl
              font-black
              mb-2
              tracking-tight
              text-white
              line-clamp-2
              leading-tight
              group-hover:text-blue-300
              transition-colors
              duration-300
            "
          >
            {experience.degree}
          </h3>

          {/* FIELD - SECONDARY INFO */}
          {experience.field && (
            <p
              className="
                text-sm
                md:text-base
                text-gray-400
                mb-2
                font-semibold
              "
            >
              {isEducation ? "Field: " : "Issued by: "}
              <span className={colorClass.text}>{experience.field}</span>
            </p>
          )}

          {/* DATE WITH ICON */}
          <div className="flex items-center gap-3 text-gray-400 mb-3 text-sm">
            <div
              className={`
                w-8
                h-8
                rounded-full
                ${colorClass.bg}/10
                flex
                items-center
                justify-center
              `}
            >
              <Calendar size={16} className={colorClass.text} />
            </div>
            <span className="font-semibold">
              {experience.startYear}
              {experience.endYear ? ` - ${experience.endYear}` : " - Present"}
            </span>
          </div>

          {/* DESCRIPTION */}
          {experience.description && (
            <p
              className="
                text-sm
                md:text-base
                text-gray-400
                leading-relaxed
                mb-4
                line-clamp-3
              "
            >
              {experience.description}
            </p>
          )}

          {/* CERTIFICATE IMAGES GALLERY - PROMINENT */}
          {isCertificate &&
            Array.isArray(experience.certificateImages) &&
            experience.certificateImages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                  📸 Certificate Images ({experience.certificateImages.length})
                </p>

                {/* GALLERY GRID - LARGER IMAGES */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                  {experience.certificateImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                      className="
                        group/img
                        relative
                        rounded-lg
                        overflow-hidden
                        aspect-square
                        border-2
                        border-amber-500/30
                        hover:border-amber-500/70
                        transition-all
                        duration-300
                        hover:scale-110
                        hover:shadow-lg
                        cursor-pointer
                      "
                      title="Click to view full size"
                    >
                      <img
                        src={imgUrl}
                        alt={`Certificate ${idx + 1}`}
                        className="w-full h-full object-cover group-hover/img:brightness-125 transition-all duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <ZoomIn
                          size={24}
                          className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {/* LIGHTBOX */}
                <CertificateLightbox
                  images={experience.certificateImages}
                  isOpen={lightboxOpen}
                  onClose={() => setLightboxOpen(false)}
                  initialIndex={lightboxIndex}
                />
              </div>
            )}

          {/* CREDENTIAL LINK */}
          {experience.certificateUrl && (
            <a
              href={experience.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className={`
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                ${colorClass.text}
                hover:${colorClass.text}/80
                transition-all
                duration-300
                mt-4
                px-4
                py-2
                rounded-lg
                ${colorClass.bg}/10
                border
                ${colorClass.border}/30
                hover:${colorClass.border}/60
              `}
            >
              <ExternalLink size={16} />
              View Credential
            </a>
          )}

          {/* BOTTOM INDICATOR */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
            <span
              className={`
                w-2
                h-2
                rounded-full
                ${colorClass.bg}
                shadow-lg
              `}
            />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-[0.15em]">
              {isEducation ? "Academic Achievement" : "Professional Certification"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
