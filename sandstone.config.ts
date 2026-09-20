import type { DatapackConfig, ResourcePackConfig, SandstoneConfig } from 'sandstone'

export default {
  name: 'betterarray',
  packs: {
    datapack: {
      description: [ 'A ', { text: 'Sandstone', color: 'gold' }, ' datapack.' ],
      packFormat: 107,
    } as DatapackConfig,
    resourcepack: {
      description: [ 'A ', { text: 'Sandstone', color: 'gold' }, ' resource pack.' ],
      packFormat: 88,
    } as ResourcePackConfig
  },
  onConflict: {
    default: 'warn',
  },
  namespace: 'betterarray',
  packUid: 'Tz1vMad9',
  mcmeta: 'latest',
  saveOptions: {},
} as SandstoneConfig
