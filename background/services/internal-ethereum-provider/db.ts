import Dexie from "dexie"
import { ETHEREUM } from "../../constants"
import { EVMNetwork } from "../../networks"
import { TALLY_INTERNAL_ORIGIN } from "./constants"

export type ActiveNetwork = {
  origin: string
  network: EVMNetwork
}

export class InternalEthereumProviderDatabase extends Dexie {
  private activeNetwork!: Dexie.Table<ActiveNetwork, string>

  constructor() {
    super("tally/internal-ethereum-provider")

    this.version(1).stores({
      activeNetwork: "&origin,chainId,network, address",
    })

    this.activeNetwork.put({
      origin: TALLY_INTERNAL_ORIGIN,
      // New installs will default to having `Ethereum` as their active chain.
      network: ETHEREUM,
    })
  }

  async setActiveChainIdForOrigin(
    origin: string,
    network: EVMNetwork
  ): Promise<string | undefined> {
    return this.activeNetwork.put({ origin, network })
  }

  async getActiveNetworkForOrigin(
    origin: string
  ): Promise<ActiveNetwork | undefined> {
    return this.activeNetwork.get({ origin })
  }
}

export async function getOrCreateDB(): Promise<InternalEthereumProviderDatabase> {
  return new InternalEthereumProviderDatabase()
}
