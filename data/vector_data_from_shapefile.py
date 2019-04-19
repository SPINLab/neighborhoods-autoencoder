from datetime import datetime

from deep_geometry import vectorizer as gv

import shapefile
from shapely.geometry import shape
import numpy as np

# Load the shapes from the shapefile
from sklearn.model_selection import train_test_split
from tqdm import tqdm

TODAY = datetime.today().strftime('%Y-%m-%d')
TRAIN_SET_FILE_NAME = 'train_data_{}.npz'.format(TODAY)
TEST_SET_FILE_NAME = 'test_data_{}.npz'.format(TODAY)

shapes = shapefile.Reader('Uitvoer_shape/buurt_2017')
shapes = shapes.shapes()
shapes = [shape(s) for s in shapes]

# convert the shapes to machine learning vectors
vectors = [gv.vectorize_wkt(s.wkt) for s in tqdm(shapes)]
dummy_labels = [0 for p in vectors]
train_data, test_data, _, _ = train_test_split(vectors, dummy_labels, test_size=0.15, random_state=42)

print('Saving training data...')
np.savez_compressed(file=TRAIN_SET_FILE_NAME, data=train_data)
print('Saving test data...')
np.savez_compressed(file=TEST_SET_FILE_NAME, data=test_data)

print('Done!')
