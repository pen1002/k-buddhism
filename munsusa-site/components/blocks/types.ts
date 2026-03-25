// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TempleData {
  code: string
  name: string
  nameEn?: string | null
  denomination?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  description?: string | null
  abbotName?: string | null
  primaryColor: string
  secondaryColor: string
  [key: string]: any
}

export interface BlockProps {
  temple: TempleData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blockData?: any
  order?: number
}
