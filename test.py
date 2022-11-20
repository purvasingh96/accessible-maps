from geojson_rewind import rewind
import geojson
import os
import json

if __name__ == "__main__":
    path = os.path.dirname(__file__)
    output = open(path + '/data/output.geojson', 'w')
    input_file = path+'/data/map1_modified.geojson'

    with open(input_file) as f:
        gj = json.load(f)
        op = rewind(gj)
        output.write(str(op))
