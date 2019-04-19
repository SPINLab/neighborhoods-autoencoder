from deep_geometry import vectorizer as gv

import shapefile
from shapely.geometry import shape

# Load the shapes from the shapefile
from sklearn.model_selection import train_test_split
from tqdm import tqdm

shapes = shapefile.Reader('Uitvoer_shape/buurt_2017')
shapes = shapes.shapes()
shapes = [shape(s) for s in shapes]

# convert the shapes to machine learning vectors
vectors = [gv.vectorize_wkt(s.wkt) for s in tqdm(shapes)]
dummy_labels = [0 for p in vectors]
train_data, test_data, _, _ = train_test_split(vectors, dummy_labels, test_size=0.15)

print('Done!')
