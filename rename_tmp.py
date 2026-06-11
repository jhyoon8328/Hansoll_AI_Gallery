# -*- coding: utf-8 -*-
import os
import shutil

src = 'Project files/총무'
dst = 'Project files/총무부'

try:
    if os.path.exists(src):
        os.rename(src, dst)
        print("Renamed successfully")
    else:
        print("Source not found")
except Exception as e:
    print("Rename failed, trying copy:", e)
    try:
        shutil.copytree(src, dst)
        print("Copied successfully")
    except Exception as e2:
        print("Copy failed:", e2)
