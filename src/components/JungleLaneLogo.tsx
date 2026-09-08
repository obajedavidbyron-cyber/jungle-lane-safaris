import React from 'react';

interface JungleLaneLogoProps {
  variant?: 'horizontal' | 'stacked' | 'emblem';
  theme?: 'dark' | 'light' | 'emerald';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  id?: string;
}

export const JungleLaneLogo: React.FC<JungleLaneLogoProps> = ({
  variant = 'horizontal',
  theme = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
  id = 'jungle-lane-logo',
}) => {
  // Color tokens based on theme
  const isLight = theme === 'light';
  const textColor = isLight ? 'text-white' : 'text-[#156D34]';
  const taglineColor = isLight ? 'text-[#E29578]' : 'text-[#156D34]/85';
  const greenFill = '#156D34';
  const strokeColor = '#156D34';

  // Sizing maps
  const emblemSizes = {
    xs: 'w-7 h-8',
    sm: 'w-9 h-10',
    md: 'w-11 h-12',
    lg: 'w-16 h-18',
    xl: 'w-24 h-28',
  };

  const textSizes = {
    xs: { title: 'text-sm', sub: 'text-[9px]', tagline: 'text-[7px]' },
    sm: { title: 'text-base', sub: 'text-[10px]', tagline: 'text-[8px]' },
    md: { title: 'text-lg sm:text-xl', sub: 'text-xs', tagline: 'text-[9px] sm:text-[10px]' },
    lg: { title: 'text-2xl sm:text-3xl', sub: 'text-sm sm:text-base', tagline: 'text-xs' },
    xl: { title: 'text-3xl sm:text-4xl', sub: 'text-lg', tagline: 'text-sm' },
  };

  // Dedicated Vector Emblem of Africa + Inside Lion Profile
  const EmblemSVG = ({ className: svgClass = '' }: { className?: string }) => (
    <svg
      viewBox="0 0 500 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-sm transition-transform duration-300 ${svgClass}`}
      aria-label="Jungle Lane Safaris Lion in Africa Emblem"
    >
      <g filter="url(#drop-shadow)">
        {/* Silhouette of Africa Continent */}
        <path
          d="
            M 195,65
            C 205,60 235,62 255,65
            C 275,67 295,62 315,70
            C 335,76 355,88 365,100
            C 375,110 380,120 388,130
            C 400,142 425,155 432,170
            C 440,185 435,200 440,218
            C 445,230 458,242 452,258
            C 448,272 432,285 428,300
            C 422,320 426,338 420,358
            C 412,382 396,408 384,430
            C 372,452 355,475 338,495
            C 328,508 312,518 298,510
            C 285,502 278,488 272,475
            C 265,455 260,432 262,408
            C 264,390 252,380 244,368
            C 232,350 216,340 200,332
            C 184,324 164,320 148,310
            C 128,298 108,278 102,252
            C 96,228 100,200 110,178
            C 120,156 138,142 150,122
            C 160,105 170,88 162,75
            C 158,68 188,70 195,65 Z
          "
          fill={greenFill}
        />

        {/* Madagascar Island */}
        <path
          d="
            M 432,385
            C 438,372 446,380 448,392
            C 452,415 444,442 436,465
            C 430,480 420,490 412,480
            C 406,472 410,455 414,440
            C 420,418 425,398 432,385 Z
          "
          fill={greenFill}
        />

        {/* Lion Profile Head & Flowing Mane Inside Africa */}
        {/* 1. Main White Mane Base */}
        <path
          d="
            M 220,95
            C 250,82 290,88 322,105
            C 346,118 368,142 378,170
            C 384,188 386,208 376,226
            C 366,246 346,260 330,276
            C 314,292 304,314 294,338
            C 288,352 284,374 270,382
            C 262,386 258,366 260,354
            C 262,334 272,314 278,294
            C 284,274 280,252 272,234
            C 262,210 238,194 224,172
            C 210,150 202,120 220,95 Z
          "
          fill="#FFFFFF"
        />

        {/* 2. Secondary White Mane Tufts Sweeping Backward */}
        <path
          d="
            M 235,115
            C 215,140 198,168 182,196
            C 174,210 166,228 172,244
            C 178,260 194,266 208,256
            C 222,246 230,228 238,212
            C 246,196 250,172 246,152
            C 244,140 240,128 235,115 Z
          "
          fill="#FFFFFF"
        />

        <path
          d="
            M 198,220
            C 182,240 170,266 176,288
            C 182,304 202,306 216,296
            C 230,286 240,266 246,248
            C 234,252 218,248 208,240
            C 202,234 200,228 198,220 Z
          "
          fill="#FFFFFF"
        />

        {/* 3. Lion Facial Contours (Green Linework) */}
        {/* Brow line & Eye */}
        <path
          d="M 322,154 C 334,148 350,150 362,158"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="
            M 332,166
            C 340,161 352,162 358,167
            C 352,172 344,174 334,170
            C 330,168 328,166 332,166 Z
          "
          fill={strokeColor}
        />
        <circle cx="344" cy="167" r="3" fill={strokeColor} />

        {/* Nose Bridge & Snout */}
        <path
          d="
            M 374,196
            C 378,190 386,192 388,198
            C 386,204 378,206 372,204
            C 370,200 372,198 374,196 Z
          "
          fill={strokeColor}
        />
        {/* Whisker Lines & Dots */}
        <path
          d="M 358,198 C 368,202 378,202 386,200"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 350,206 C 360,210 372,212 380,208"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="362" cy="204" r="1.5" fill={strokeColor} />
        <circle cx="368" cy="205" r="1.5" fill={strokeColor} />
        <circle cx="358" cy="210" r="1.4" fill={strokeColor} />
        <circle cx="364" cy="211" r="1.4" fill={strokeColor} />

        {/* Mouth & Powerful Chin */}
        <path
          d="M 346,220 C 358,224 370,222 378,214"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 336,234 C 346,236 358,234 366,226"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Lion Ear */}
        <path
          d="
            M 292,126
            C 298,114 310,116 314,128
            C 310,138 300,142 294,136
            C 290,132 290,128 292,126 Z
          "
          fill={strokeColor}
        />

        {/* Flowing Mane Strands inside white area */}
        <path
          d="M 274,120 C 290,136 300,160 304,184"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 250,140 C 270,160 282,188 286,216"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 234,172 C 254,196 264,224 268,256"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 226,212 C 242,240 254,272 256,304"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 302,244 C 308,268 310,292 304,320"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  // 1. EMBLEM ONLY VARIANT
  if (variant === 'emblem') {
    return (
      <div id={id} className={`inline-flex items-center justify-center ${className}`}>
        <EmblemSVG className={emblemSizes[size]} />
      </div>
    );
  }

  // 2. STACKED VARIANT (Perfect for Footer, Welcome modals, Hero, About Us)
  if (variant === 'stacked') {
    return (
      <div id={id} className={`flex flex-col items-center text-center group ${className}`}>
        <EmblemSVG className={`${emblemSizes[size]} mb-2 group-hover:scale-105 transition-transform duration-300`} />
        
        <div className="space-y-0.5">
          <span className={`block font-serif font-black tracking-wider uppercase leading-none ${textColor} ${textSizes[size].title}`}>
            JUNGLELANE
          </span>
          <span className={`block font-serif font-black tracking-[0.25em] uppercase leading-tight ${isLight ? 'text-[#C86D51]' : 'text-[#156D34]'} ${textSizes[size].sub}`}>
            SAFARIS
          </span>
        </div>

        {showTagline && (
          <span className={`block font-sans font-bold tracking-[0.2em] uppercase mt-1.5 ${taglineColor} ${textSizes[size].tagline}`}>
            EXPLORE AFRICA WITH AFRICANS
          </span>
        )}
      </div>
    );
  }

  // 3. HORIZONTAL VARIANT (Default for Navbar, Headers)
  return (
    <div id={id} className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      <EmblemSVG className={`${emblemSizes[size]} group-hover:scale-105 transition-transform duration-300`} />
      
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className={`font-serif font-black tracking-tight uppercase ${textColor} ${textSizes[size].title}`}>
            JUNGLELANE
          </span>
          <span className={`font-serif font-extrabold tracking-wider uppercase ${isLight ? 'text-[#C86D51]' : 'text-[#156D34]'} ${textSizes[size].title}`}>
            SAFARIS
          </span>
        </div>

        {showTagline && (
          <span className={`font-sans font-bold tracking-[0.16em] uppercase mt-0.5 ${taglineColor} ${textSizes[size].tagline}`}>
            EXPLORE AFRICA WITH AFRICANS
          </span>
        )}
      </div>
    </div>
  );
};
