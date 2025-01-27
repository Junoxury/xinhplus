import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: '#FF6B9C',
  				hover: '#FF4F89',
  				active: '#FF3377',
  				light: '#FFF0F5',
  				dark: '#CC5580',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: '#A78BFA',
  				hover: '#9061F9',
  				active: '#7C3AED',
  				light: '#F5F0FF',
  				dark: '#6D28D9',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			tertiary: {
  				DEFAULT: '#F472B6',
  				container: '#FCE7F3',
  				onContainer: '#831843',
  			},
  			surface: {
  				DEFAULT: '#FFFBFE',
  				dim: '#E5E7EB',
  				container: {
  					lowest: '#FFFFFF',
  					low: '#F9FAFB',
  					DEFAULT: '#F3F4F6',
  					high: '#E5E7EB',
  				},
  			},
  			outline: {
  				DEFAULT: '#94A3B8',
  				variant: '#CBD5E1',
  			},
  			elevation: {
  				1: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
  				2: '0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
  				3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				gold: '#FCD34D',
  				coral: '#FB7185',
  				mint: '#6EE7B7',
  				rose: '#FDA4AF',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			ios: {
  				primary: '#007AFF',      // iOS Blue
  				secondary: '#5856D6',    // iOS Purple
  				success: '#34C759',      // iOS Green
  				warning: '#FF9500',      // iOS Orange
  				error: '#FF3B30',        // iOS Red
  				gray: {
  					100: '#F2F2F7',
  					200: '#E5E5EA',
  					300: '#D1D1D6',
  					400: '#C7C7CC',
  					500: '#AEAEB2',
  					600: '#8E8E93',
  					700: '#636366',
  					800: '#48484A',
  					900: '#3A3A3C'
  				},
  				background: {
  					primary: '#FFFFFF',
  					secondary: '#F2F2F7',
  					tertiary: '#FFFFFF'
  				},
  				blue: {
  					light: '#007AFF',
  					dark: '#0A84FF'
  				},
  				separator: 'rgba(60, 60, 67, 0.36)',
  				overlay: 'rgba(0, 0, 0, 0.4)'
  			},
  			status: {
  				success: '#4ADE80',
  				warning: '#FBBF24',
  				error: '#F87171',
  				info: '#60A5FA'
  			},
  			section: {
  				category: {
  					DEFAULT: '#FFF0F5',  // 부드러운 핑크 배경
  					hover: '#FFE4EE'
  				},
  				treatment: {
  					DEFAULT: '#F5F0FF',  // 연한 라벤더 배경
  					hover: '#EBE4FF'
  				},
  				clinic: {
  					DEFAULT: '#F0F9FF',  // 하늘빛 배경
  					hover: '#E4F3FF'
  				},
  				review: {
  					DEFAULT: '#FDF2F8',  // 로즈 톤 배경
  					hover: '#FCE7F3'
  				},
  				// 그라데이션 배경을 위한 설정
  				gradient: {
  					pink: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EE 100%)',
  					purple: 'linear-gradient(135deg, #F5F0FF 0%, #EBE4FF 100%)',
  					blue: 'linear-gradient(135deg, #F0F9FF 0%, #E4F3FF 100%)',
  					rose: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)'
  				}
  			}
  		},
  		borderRadius: {
  			none: '0px',
  			sm: '4px',
  			base: '6px',
  			md: '8px',
  			lg: '12px',
  			xl: '16px',
  			full: '9999px'
  		},
  		fontFamily: {
  			sans: [
          'var(--font-noto-sans)',
          'var(--font-noto-sans-kr)',
          'system-ui',
          'sans-serif'
        ],
  			primary: ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
  			secondary: ['Montserrat', 'system-ui', 'sans-serif']
  		},
  		boxShadow: {
  			sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  			base: '0 1px 3px rgba(0, 0, 0, 0.1)',
  			md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  			lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  			xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
  		},
  		keyframes: {
  			"accordion-down": {
  				from: { height: "0" },
  				to: { height: "var(--radix-accordion-content-height)" },
  			},
  			"accordion-up": {
  				from: { height: "var(--radix-accordion-content-height)" },
  				to: { height: "0" },
  			},
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography')
  ]
}

export default config;
