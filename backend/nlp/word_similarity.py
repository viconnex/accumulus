import math


WORDEMBEDDER = None
T = 1/12


def init_wordembedder(
        fname="../resources/cc.fr.300.vec",
        limit=10000):
    global WORDEMBEDDER
    from gensim.models import KeyedVectors
    print("Loading word2Vec from fname: %s" % fname)
    WORDEMBEDDER = KeyedVectors.load_word2vec_format(
        fname, binary=False,
        limit=limit)


def similarity(word1, word2):
    """todo"""
    global WORDEMBEDDER
    if WORDEMBEDDER is None:
        init_wordembedder()

    assert word1 in WORDEMBEDDER
    assert word1 in WORDEMBEDDER
    return WORDEMBEDDER.similarity(word1, word2)


def sigmoid(x):
    return 1 / (1 + math.exp(-x))


def compute_location(similarity1, similarity2):
    mean = similarity2 / (similarity1 + similarity2)
    return sigmoid((mean - 1/2)/T)


def compute_similarity_word_listchords(word, list_chords):
    for chords in list_chords:
        chords["leftSim"] = similarity(word, chords["leftNote"])
        chords["rightSim"] = similarity(word, chords["rightNote"])
        chords["note"] = compute_location(
            chords["leftSim"],
            chords["rightSim"])
    return list_chords


def get_parser():
    import argparse
    parser = argparse.ArgumentParser(description="Do something.")
    parser.add_argument('--fname', type=str, default="../resources/cc.fr.300.vec")
    parser.add_argument('--limit', type=float, default=100000)
    return parser


def main():
    parser = get_parser()
    args = parser.parse_args()

    init_wordembedder(
        fname=args.fname,
        limit=args.limit)
    word = "papa"
    list_chords = [
        {"leftNote": "méchant",
         "rightNote": "gentil"},
        {"leftNote": "méchant",
         "rightNote": "gentil"},
        {"leftNote": "avare",
         "rightNote": "généreux"}
    ]
    compute_similarity_word_listchords(word, list_chords)
    print("list_chords: %s" % list_chords)
    papamostsimilar = WORDEMBEDDER.most_similar("papa")
    print("papamostsimilar: %s" % str(papamostsimilar))
    hommemostsimilar = WORDEMBEDDER.most_similar(
        positive=["femme", "roi"],
        negative=["reine"])
    print("hommemostsimilar: %s" % hommemostsimilar)


if __name__ == "__main__":
    main()
