import redis
from django.conf import settings

class RedisLeaderboard:
    def __init__(self, name="candidate_leaderboard"):
        self.redis_client = redis.StrictRedis.from_url(settings.CACHES['default']['LOCATION'])
        self.name = name

    def add_vote(self, candidate_name, score=1):
        """Increment candidate votes in the leaderboard."""
        self.redis_client.zincrby(self.name, score, candidate_name)

    def get_leaderboard(self, top_n=10):
        """Retrieve top N candidates from the leaderboard."""
        return self.redis_client.zrevrange(self.name, 0, top_n - 1, withscores=True)
