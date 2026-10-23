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
  SiPostgresql,
  SiSupabase,
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
  SiCoursera,
  SiGoogle,
  SiGooglecloud,
  SiVercel,
} from '@icons-pack/react-simple-icons'

// Custom fallback SVGs for brands not in Simple Icons package
function LinkedinIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.63 1.63 0 1 0 0-3.26 1.63 1.63 0 0 0 0 3.26m1.4 9.74V9.87H5.06v8.63h2.8z" />
    </svg>
  )
}

function AwsIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.75 14.25c-.2-.15-.45-.25-.75-.25-.3 0-.6.1-.8.3-.35.35-.45.85-.45 1.45 0 .6.1 1.1.45 1.45.2.2.5.3.8.3.3 0 .55-.1.75-.25.2-.15.35-.4.4-.7h1.65c-.1.7-.45 1.3-1 1.7-.55.4-1.25.6-2.05.6-.9 0-1.7-.3-2.3-.9-.6-.6-.9-1.4-.9-2.5 0-1.1.3-1.9.9-2.5.6-.6 1.4-.9 2.3-.9.8 0 1.5.2 2.05.6.55.4.9 1 1 1.7h-1.65c-.05-.3-.2-.55-.4-.7zM3.25 18l3.1-9h1.9l3.1 9h-1.85l-.7-2.25H5.8L5.1 18H3.25zm3.05-3.8h2.05L7.3 10.6h-.05l-1.05 3.6h.1zm8.3 3.8l-1.6-9h1.75l1.05 6.75h.05L18.4 9h1.85l-1.6 9h-1.95zM2.5 21.5c4.8 2 11.2 2 16.5-.5.35-.15.8-.3 1.1-.6.3-.3.4-.6.2-.9-.2-.3-.6-.3-.9-.2-4.8 2.2-10.7 2.2-15.3-.2-.3-.15-.7-.1-.9.15-.2.25-.1.6.3.85z" />
    </svg>
  )
}

function OracleIcon({ size = 20, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
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
  | 'postgresql'
  | 'postgres'
  | 'supabase'
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
}

export function Icon({
  name,
  size = 20,
  className = '',
  strokeWidth = 1.5,
  ...rest
}: IconProps) {
  if (!name) {
    return <Code2 size={size} strokeWidth={strokeWidth} className={className} {...rest} />
  }

  const normalized = name.toLowerCase().trim()

  // 1. Check brand tech icons
  switch (normalized) {
    case 'react':
    case 'react.js':
    case 'reactjs':
      return <SiReact size={size} className={className} />
    case 'nextjs':
    case 'next.js':
    case 'next':
      return <SiNextdotjs size={size} className={className} />
    case 'typescript':
    case 'ts':
      return <SiTypescript size={size} className={className} />
    case 'javascript':
    case 'js':
      return <SiJavascript size={size} className={className} />
    case 'python':
      return <SiPython size={size} className={className} />
    case 'nodejs':
    case 'node.js':
    case 'node':
      return <SiNodedotjs size={size} className={className} />
    case 'postgresql':
    case 'postgres':
      return <SiPostgresql size={size} className={className} />
    case 'supabase':
      return <SiSupabase size={size} className={className} />
    case 'tailwindcss':
    case 'tailwind':
    case 'tailwind css':
      return <SiTailwindcss size={size} className={className} />
    case 'docker':
      return <SiDocker size={size} className={className} />
    case 'git':
      return <SiGit size={size} className={className} />
    case 'github':
      return <SiGithub size={size} className={className} />
    case 'linkedin':
      return <LinkedinIcon size={size} className={className} />
    case 'graphql':
      return <SiGraphql size={size} className={className} />
    case 'redis':
      return <SiRedis size={size} className={className} />
    case 'figma':
      return <SiFigma size={size} className={className} />
    case 'linux':
      return <SiLinux size={size} className={className} />
    case 'html':
    case 'html5':
      return <SiHtml5 size={size} className={className} />
    case 'css':
    case 'css3':
      return <SiCss size={size} className={className} />
    case 'coursera':
      return <SiCoursera size={size} className={className} />
    case 'google':
    case 'gdsc':
      return <SiGoogle size={size} className={className} />
    case 'googlecloud':
    case 'gcp':
      return <SiGooglecloud size={size} className={className} />
    case 'vercel':
      return <SiVercel size={size} className={className} />
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
