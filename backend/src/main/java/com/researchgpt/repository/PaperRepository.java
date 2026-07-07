package com.researchgpt.repository;

import com.researchgpt.entity.Paper;
import com.researchgpt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaperRepository extends JpaRepository<Paper, Long> {

    List<Paper> findByOwnerOrderByUploadDateDesc(User owner);

    Optional<Paper> findByIdAndOwner(Long id, User owner);
}