package com.danishabdullah.gameoflife.service;

import com.danishabdullah.gameoflife.dao.IGameDao;
import com.danishabdullah.gameoflife.service.IGameService;
import com.danishabdullah.gameoflife.model.Game;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;


import java.util.List;

@Service
@Transactional
public class GameService implements IGameService {

    @Autowired
    private IGameDao gameDao;

    @Autowired
    private JdbcTemplate jtm;

    @Override
    public void create(Game game) {
        gameDao.create(game);
    }

    @Override
    public List<Game> findAll() {
        String sql = "SELECT * FROM gamesoflife";
        List<Game> games = jtm.query(sql, new BeanPropertyRowMapper(Game.class));
        return games;
    }

    @Override
    public Game findById(int id) {
        String sql = "SELECT * FROM gamesoflife WHERE ID=?";
        Game game = (Game) jtm.queryForObject(sql, new Object[]{id},
                                              new BeanPropertyRowMapper(Game.class));
        return game;
    }
}
