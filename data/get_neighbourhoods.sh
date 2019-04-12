#!/usr/bin/env bash
set -ex
# The script is downloading the neighbourhoods shapefile
# We used the 2017 set because it contains a lot more interesting available statistics than the 2018 set contains at the moment when we requested the file, which was on April 12, 2019
wget -O neighbourhoods2017.zip https://www.cbs.nl/-/media/cbs/dossiers/nederland%20regionaal/wijk-en-buurtstatistieken/2018/shape%202017%20versie%2020.zip
unzip neighbourhoods2017.zip
