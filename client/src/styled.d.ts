import "styled-components"

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      mainText: string
      subText: string
      lightBg: string
      primary: string
      primary_600: string
      disabled: string
      whiteText: string
    }

    fonts: {
      default: string
    }

    fontWeight: {
      reguar: number
      medium: number
      bold: number
    }
  }
}
