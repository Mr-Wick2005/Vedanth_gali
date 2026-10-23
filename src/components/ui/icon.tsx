import React from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ArrowDown,
  ExternalLink,
  Link as LinkIcon,
  Download,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  CalendarDays,
  Award,
  CheckCircle2,
  Check,
  Copy,
  Sparkles,
  Code2,
  Terminal,
  Layers,
  Cpu,
  Database,
  Server,
  Users,
  Globe,
  Briefcase,
  GraduationCap,
  FileText,
  Folder,
  Eye,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  type LucideProps,
} from 'lucide-react'

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiSupabase,
  SiMysql,
  SiTailwindcss,
  SiDocker,
  SiGit,
  SiGithub,
  SiGraphql,
  SiRedis,
  SiFigma,
  SiLinux,
  SiHtml5,
  SiCss,
  SiVite,
  SiC,
  SiTensorflow,
  SiKeras,
  SiCoursera,
  SiGoogle,
  SiGooglecloud,
  SiVercel,
} from '@icons-pack/react-simple-icons'

// Custom high-quality brand SVGs with official brand colors
function JavaIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#ED8B00" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M8.85 16.34s-.54.05-.77.16c-1.3.62-1.28 1.43-.16 2.06 1.48.83 5.48.86 7.02.04 1.14-.6.9-1.39-.42-1.99-.44-.2-1.07-.27-1.07-.27s.35.32.2.49c-.27.32-1.14.47-2.33.47-1.3 0-2.07-.17-2.47-.46zm-.49-2.92s-.43.12-.59.27c-.88.8-1.03 1.7.35 2.37 1.8.87 6.16.89 8.16-.06 1.34-.63 1.17-1.63-.44-2.28-.48-.2-1.05-.3-1.05-.3s.25.32.09.52c-.32.4-1.57.6-3.15.6-1.74 0-2.88-.22-3.37-.62zm5.7-8.07c.43 1.43-.37 2.69-1.76 3.99-1.12 1.05-1.55 1.83-1.29 2.66.45 1.45 2.1 1.77 2.1 1.77s-.86-.63-1.22-1.34c-.38-.76-.23-1.58.74-2.5 1.38-1.3 1.87-2.67 1.43-4.58zm-3.08-5.35c.48 1.35-.41 2.54-1.97 3.77-1.26 1-1.75 1.73-1.45 2.52.52 1.37 2.37 1.67 2.37 1.67s-.97-.59-1.38-1.26c-.43-.72-.26-1.5.83-2.37 1.55-1.23 2.1-2.53 1.6-4.33zM3 20.5c3.2 1.8 11.2 1.8 14.5-.2.4-.25.8-.3 1.1-.3.8 0 1.4.6 1.4 1.4 0 .9-.8 1.6-1.8 1.9-4.2 1.2-12.8 1.1-17.2-.9-.4-.2-.7-.5-.7-.9 0-.6.5-1 1-1 .5 0 1.2.5 1.7.9z" />
    </svg>
  )
}

function VsCodeIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#007ACC" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.65 1.35a1.5 1.5 0 0 0-1.18.33L9.63 7.56 5.6 4.5a1.5 1.5 0 0 0-1.84.05L1.4 6.46A1.5 1.5 0 0 0 1 7.6v8.8c0 .48.23.93.62 1.2l2.36 1.91a1.5 1.5 0 0 0 1.84.05l4.03-3.06 6.84 5.88a1.5 1.5 0 0 0 2.47-.85l3.8-18.2a1.5 1.5 0 0 0-1.31-1.98zM16.5 18.2l-6.1-5.24 6.1-5.24v10.48z" />
    </svg>
  )
}

function SqlIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#00758F" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="5" rx="9" ry="3" fill="#00758F" />
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" fill="none" stroke="#38BDF8" strokeWidth="2" />
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" fill="none" stroke="#38BDF8" strokeWidth="2" />
    </svg>
  )
}

function RestApiIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="8" rx="2" fill="rgba(167,139,250,0.15)" />
      <rect x="2" y="14" width="20" height="8" rx="2" fill="rgba(167,139,250,0.15)" />
      <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
      <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
    </svg>
  )
}

function UiUxIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 1.8-.8 1.8-1.8 0-.5-.2-1-.5-1.3-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.3c3.8 0 6.9-3.1 6.9-6.9 0-5.3-4.5-9.6-10-9.6z" fill="rgba(236,72,153,0.15)" />
      <circle cx="7.5" cy="9.5" r="1.5" fill="#EC4899" />
      <circle cx="12" cy="7" r="1.5" fill="#38BDF8" />
      <circle cx="16.5" cy="9.5" r="1.5" fill="#FACC15" />
      <circle cx="10" cy="14" r="1.5" fill="#10B981" />
    </svg>
  )
}

function ResponsiveDesignIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="14" rx="2" fill="rgba(56,189,248,0.12)" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <rect x="14" y="8" width="6" height="9" rx="1" fill="#38BDF8" />
    </svg>
  )
}

function AntigravityIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" fill="rgba(139,92,246,0.3)" />
      <circle cx="12" cy="12" r="3" fill="#A78BFA" />
    </svg>
  )
}

function LinkedinIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.63 1.63 0 1 0 0-3.26 1.63 1.63 0 0 0 0 3.26m1.4 9.74V9.87H5.06v8.63h2.8z" />
    </svg>
  )
}

function AwsIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF9900" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M18.75 14.25c-.2-.15-.45-.25-.75-.25-.3 0-.6.1-.8.3-.35.35-.45.85-.45 1.45 0 .6.1 1.1.45 1.45.2.2.5.3.8.3.3 0 .55-.1.75-.25.2-.15.35-.4.4-.7h1.65c-.1.7-.45 1.3-1 1.7-.55.4-1.25.6-2.05.6-.9 0-1.7-.3-2.3-.9-.6-.6-.9-1.4-.9-2.5 0-1.1.3-1.9.9-2.5.6-.6 1.4-.9 2.3-.9.8 0 1.5.2 2.05.6.55.4.9 1 1 1.7h-1.65c-.05-.3-.2-.55-.4-.7zM3.25 18l3.1-9h1.9l3.1 9h-1.85l-.7-2.25H5.8L5.1 18H3.25zm3.05-3.8h2.05L7.3 10.6h-.05l-1.05 3.6h.1zm8.3 3.8l-1.6-9h1.75l1.05 6.75h.05L18.4 9h1.85l-1.6 9h-1.95zM2.5 21.5c4.8 2 11.2 2 16.5-.5.35-.15.8-.3 1.1-.6.3-.3.4-.6.2-.9-.2-.3-.6-.3-.9-.2-4.8 2.2-10.7 2.2-15.3-.2-.3-.15-.7-.1-.9.15-.2.25-.1.6.3.85z" />
    </svg>
  )
}

function OracleIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F80000" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M16.42 4.4H7.58A7.6 7.6 0 0 0 0 12a7.6 7.6 0 0 0 7.58 7.6h8.84A7.6 7.6 0 0 0 24 12a7.6 7.6 0 0 0-7.58-7.6zm-.32 11.76H7.9a4.16 4.16 0 0 1 0-8.32h8.2a4.16 4.16 0 0 1 0 8.32z" />
    </svg>
  )
}

export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-left'
  | 'arrow-down'
  | 'external-link'
  | 'link'
  | 'download'
  | 'mail'
  | 'phone'
  | 'map-pin'
  | 'clock'
  | 'calendar'
  | 'calendar-days'
  | 'award'
  | 'check-circle'
  | 'check'
  | 'copy'
  | 'sparkles'
  | 'code'
  | 'terminal'
  | 'layers'
  | 'cpu'
  | 'database'
  | 'server'
  | 'users'
  | 'globe'
  | 'briefcase'
  | 'graduation-cap'
  | 'file-text'
  | 'folder'
  | 'eye'
  | 'shield-check'
  | 'chevron-right'
  | 'chevron-left'
  | 'menu'
  | 'x'
  | 'github'
  | 'linkedin'
  | 'react'
  | 'nextjs'
  | 'next.js'
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'nodejs'
  | 'node.js'
  | 'express'
  | 'express.js'
  | 'postgresql'
  | 'postgres'
  | 'supabase'
  | 'mysql'
  | 'tailwindcss'
  | 'tailwind'
  | 'docker'
  | 'git'
  | 'graphql'
  | 'redis'
  | 'figma'
  | 'linux'
  | 'html5'
  | 'html'
  | 'css3'
  | 'css'
  | 'vite'
  | 'c'
  | 'java'
  | 'sql'
  | 'rest api'
  | 'rest apis'
  | 'ui/ux'
  | 'responsive design'
  | 'vs code'
  | 'vscode'
  | 'antigravity'
  | 'tensorflow'
  | 'keras'
  | 'coursera'
  | 'google'
  | 'googlecloud'
  | 'vercel'
  | 'aws'
  | 'amazon'
  | 'oracle'
  | string

export interface IconProps extends Omit<LucideProps, 'ref' | 'name'> {
  name?: IconName | null
  size?: number | string
  className?: string
  strokeWidth?: number
  colored?: boolean
}

export function Icon({
  name,
  size = 20,
  className = '',
  strokeWidth = 1.5,
  colored = true,
  ...rest
}: IconProps) {
  if (!name) {
    return <Code2 size={size} strokeWidth={strokeWidth} className={className} {...rest} />
  }

  const normalized = name.toLowerCase().trim()

  // 1. Check brand tech icons with official vibrant brand colors
  switch (normalized) {
    case 'react':
    case 'react.js':
    case 'reactjs':
      return <SiReact size={size} color={colored ? '#61DAFB' : undefined} className={className} />
    case 'nextjs':
    case 'next.js':
    case 'next':
      return <SiNextdotjs size={size} color={colored ? '#FFFFFF' : undefined} className={className} />
    case 'typescript':
    case 'ts':
      return <SiTypescript size={size} color={colored ? '#3178C6' : undefined} className={className} />
    case 'javascript':
    case 'js':
      return <SiJavascript size={size} color={colored ? '#F7DF1E' : undefined} className={className} />
    case 'python':
      return <SiPython size={size} color={colored ? '#3776AB' : undefined} className={className} />
    case 'nodejs':
    case 'node.js':
    case 'node':
      return <SiNodedotjs size={size} color={colored ? '#5FA04E' : undefined} className={className} />
    case 'express':
    case 'express.js':
      return <SiExpress size={size} color={colored ? '#E2E8F0' : undefined} className={className} />
    case 'postgresql':
    case 'postgres':
      return <SiPostgresql size={size} color={colored ? '#4169E1' : undefined} className={className} />
    case 'supabase':
      return <SiSupabase size={size} color={colored ? '#3FCF8E' : undefined} className={className} />
    case 'mysql':
      return <SiMysql size={size} color={colored ? '#4479A1' : undefined} className={className} />
    case 'tailwindcss':
    case 'tailwind':
    case 'tailwind css':
      return <SiTailwindcss size={size} color={colored ? '#06B6D4' : undefined} className={className} />
    case 'docker':
      return <SiDocker size={size} color={colored ? '#2496ED' : undefined} className={className} />
    case 'git':
      return <SiGit size={size} color={colored ? '#F03C2E' : undefined} className={className} />
    case 'github':
      return <SiGithub size={size} color={colored ? '#FFFFFF' : undefined} className={className} />
    case 'linkedin':
      return <LinkedinIcon size={size} className={className} />
    case 'graphql':
      return <SiGraphql size={size} color={colored ? '#E10098' : undefined} className={className} />
    case 'redis':
      return <SiRedis size={size} color={colored ? '#DC382D' : undefined} className={className} />
    case 'figma':
      return <SiFigma size={size} color={colored ? '#F24E1E' : undefined} className={className} />
    case 'linux':
      return <SiLinux size={size} color={colored ? '#FCC624' : undefined} className={className} />
    case 'html':
    case 'html5':
      return <SiHtml5 size={size} color={colored ? '#E34F26' : undefined} className={className} />
    case 'css':
    case 'css3':
      return <SiCss size={size} color={colored ? '#264DE4' : undefined} className={className} />
    case 'vite':
      return <SiVite size={size} color={colored ? '#9135FF' : undefined} className={className} />
    case 'c':
      return <SiC size={size} color={colored ? '#A8B9CC' : undefined} className={className} />
    case 'java':
      return <JavaIcon size={size} className={className} />
    case 'sql':
      return <SqlIcon size={size} className={className} />
    case 'rest api':
    case 'rest apis':
    case 'api':
    case 'apis':
      return <RestApiIcon size={size} className={className} />
    case 'ui/ux':
    case 'uiux':
    case 'layout':
      return <UiUxIcon size={size} className={className} />
    case 'responsive design':
    case 'responsive':
      return <ResponsiveDesignIcon size={size} className={className} />
    case 'vs code':
    case 'vscode':
      return <VsCodeIcon size={size} className={className} />
    case 'antigravity':
      return <AntigravityIcon size={size} className={className} />
    case 'tensorflow':
      return <SiTensorflow size={size} color={colored ? '#FF6F00' : undefined} className={className} />
    case 'keras':
      return <SiKeras size={size} color={colored ? '#D00000' : undefined} className={className} />
    case 'coursera':
      return <SiCoursera size={size} color={colored ? '#0056D2' : undefined} className={className} />
    case 'google':
    case 'gdsc':
      return <SiGoogle size={size} color={colored ? '#4285F4' : undefined} className={className} />
    case 'googlecloud':
    case 'gcp':
      return <SiGooglecloud size={size} color={colored ? '#4285F4' : undefined} className={className} />
    case 'vercel':
      return <SiVercel size={size} color={colored ? '#FFFFFF' : undefined} className={className} />
    case 'aws':
    case 'amazon':
    case 'amazon web services':
      return <AwsIcon size={size} className={className} />
    case 'oracle':
      return <OracleIcon size={size} className={className} />
  }

  // 2. Check UI Lucide icons
  switch (normalized) {
    case 'arrow-right':
    case 'arrowright':
      return <ArrowRight size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'arrow-up-right':
    case 'arrowupright':
    case 'external':
      return <ArrowUpRight size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'arrow-left':
    case 'arrowleft':
      return <ArrowLeft size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'arrow-down':
    case 'arrowdown':
      return <ArrowDown size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'external-link':
    case 'link-external':
      return <ExternalLink size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'link':
      return <LinkIcon size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'download':
      return <Download size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'mail':
    case 'email':
      return <Mail size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'phone':
      return <Phone size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'map-pin':
    case 'location':
      return <MapPin size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'clock':
    case 'time':
      return <Clock size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'calendar':
      return <Calendar size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'calendar-days':
      return <CalendarDays size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'award':
    case 'certificate':
    case 'certification':
      return <Award size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'check-circle':
    case 'verified':
      return <CheckCircle2 size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'check':
      return <Check size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'copy':
      return <Copy size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'sparkles':
      return <Sparkles size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'code':
    case 'code2':
      return <Code2 size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'terminal':
      return <Terminal size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'layers':
      return <Layers size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'cpu':
      return <Cpu size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'database':
      return <Database size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'server':
      return <Server size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'users':
    case 'team':
      return <Users size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'globe':
      return <Globe size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'briefcase':
    case 'work':
      return <Briefcase size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'graduation-cap':
    case 'education':
      return <GraduationCap size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'file-text':
    case 'document':
      return <FileText size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'folder':
      return <Folder size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'eye':
      return <Eye size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'shield-check':
      return <ShieldCheck size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'chevron-right':
      return <ChevronRight size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'chevron-left':
      return <ChevronLeft size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'menu':
      return <Menu size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    case 'x':
    case 'close':
      return <X size={size} strokeWidth={strokeWidth} className={className} {...rest} />
    default:
      return <Code2 size={size} strokeWidth={strokeWidth} className={className} {...rest} />
  }
}
