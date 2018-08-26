import tensorflow as tf
import numpy as np
from tensorflow import keras
import h5py
import sys
import json
#from indicoio.custom import Collection
#indicoio.config.api_key = '3403eabc00db0763fda679fb224111be'

with open("dictionary.json",'r') as dict_file:
	dictionary=json.load(dict_file)

def text_to_index_array(text):
	arr = [dictionary.get(word) for word in keras.preprocessing.text.text_to_word_sequence(text)]
	return [x if x is not None else 0 for x in arr]


def main():
	index_array = text_to_index_array(sys.argv[1])
	index_array = np.asarray(index_array)

	x = []
	x.append(index_array)

	index_array = keras.preprocessing.sequence.pad_sequences(x, value=0, padding='post', maxlen=256)

	json_file = open("embedding_model.json",'r')
	loaded_model_json = json_file.read()
	json_file.close()
	loaded_model = keras.models.model_from_json(loaded_model_json)

	loaded_model.load_weights("embedding_model_weight.h5")

	loaded_model.compile(optimizer=keras.optimizers.Adam(), loss='binary_crossentropy', metrics=['accuracy'])
	prediction = loaded_model.predict(index_array)

	#collection = Collection("Depression_Classifier")
	#prediction_indico = collection.predict(sys.argv[1])
	print(prediction)
	#print((prediction + prediction_indico)/2)
	sys.stdout.flush()


if __name__ == '__main__':
	main()