import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
  const date = new Date(isDateOnly ? `${dateString}T00:00:00` : dateString)

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
  }

  return date.toLocaleDateString('pt-BR', { ...defaultOptions, ...options })
}

export function toSnakeCase(str: string): string {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

