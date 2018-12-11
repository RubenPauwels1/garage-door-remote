import pifacerelayplus
import sys

pfr = pifacerelayplus.PiFaceRelayPlus(pifacerelayplus.RELAY)
pfr.relays[0].toggle()