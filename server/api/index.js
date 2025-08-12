import path from 'path'

export default defineEventHandler(() => {
  return {
    aboutAPI: "API for the Vulgate/Douay-Rheims Bible",
    about: "The Vulgate is a version of the Bible",
    contact: "bohemdev@tutanota.com",
    dbSourcePath: path.resolve(process.cwd(), 'server/api/v.db')
  }
})
