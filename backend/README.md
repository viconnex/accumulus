# Serving

# nlp

## get embeddings

```
cd resources
wget https://dl.fbaipublicfiles.com/fasttext/vectors-crawl/cc.fr.300.vec.gz

# wget https://dl.fbaipublicfiles.com/arrival/vectors/wiki.multi.fr.vec

gunzip cc.fr.300.vec.gz

cd ../nlp
python3 word_similarity.py --action tobin --limit 0
```


## antonyms english

```
cd resources
wget http://www.ims.uni-stuttgart.de/data/dLCE/wiki_en_dLCE_100d_minFreq_100.bin
```
