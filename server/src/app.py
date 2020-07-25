#!/usr/bin/env python3
import signal
import sys 
import runpy

def on_ctrlc(signal, frame):
    sys.exit(0)

signal.signal(signal.SIGINT, on_ctrlc)
runpy.run_module('swagger_server', run_name='__main__', alter_sys=True)